'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  roasterId: string;
  roasterSlug: string;
  roasterName: string;
  coffeeOptions: string[];
};

const BREW_METHODS = ['Pour Over', 'Espresso', 'French Press', 'Aeropress', 'Moka Pot', 'Cold Brew', 'Other'];

export default function ReviewForm({ roasterId, roasterSlug, roasterName, coffeeOptions }: Props) {
  const [userId, setUserId] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(0);
  const [coffeeName, setCoffeeName] = useState<string>('');
  const [brewMethod, setBrewMethod] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const [needLogin, setNeedLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingLink, setSendingLink] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const draftKey = useMemo(() => `er_review_draft__${roasterSlug}`, [roasterSlug]);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user ?? null;
      setUserId(u?.id ?? null);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_evt, session) => {
        setUserId(session?.user?.id ?? null);
      });
      unsub = () => subscription.unsubscribe();

      try {
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const d = JSON.parse(raw);
          if (d.roasterSlug === roasterSlug) {
            setRating(d.rating || 0);
            setCoffeeName(d.coffeeName || '');
            setBrewMethod(d.brewMethod || '');
            setNotes(d.notes || '');
          }
        }
      } catch {}
    })();

    return () => {
      if (unsub) unsub();
    };
  }, [draftKey, roasterSlug]);

  useEffect(() => {
    const draft = { roasterSlug, rating, coffeeName, brewMethod, notes };
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {}
  }, [draftKey, roasterSlug, rating, coffeeName, brewMethod, notes]);

  const uploadPhoto = async (): Promise<string | null> => {
    if (!file || !userId) return null;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('review-photos').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('review-photos').getPublicUrl(path);
    return data.publicUrl ?? null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    if (!rating) return setErr('Please select a star rating.');
    if (!userId) {
      setNeedLogin(true);
      return;
    }

    try {
      setSubmitting(true);
      let photoUrl: string | null = null;
      if (file) photoUrl = await uploadPhoto();

      const { error } = await supabase.from('reviews').insert({
        roaster_id: roasterId,
        roaster_slug: roasterSlug,
        roaster_name: roasterName,
        coffee_name: coffeeName || null,
        brew_method: brewMethod || null,
        rating,
        notes: notes || null,
        photo_url: photoUrl,
        user_id: userId,
      });
      if (error) throw error;

      try { localStorage.removeItem(draftKey); } catch {}
      setSubmitted(true);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const sendMagicLink = async () => {
    setErr(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Please enter a valid email.');
    try {
      setSendingLink(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/review/${roasterSlug}` },
      });
      if (error) throw error;
      alert('Check your email for a login link. Return here to publish your review.');
    } catch (e: any) {
      setErr(e?.message || 'Could not send login link.');
    } finally {
      setSendingLink(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 bg-white">
        <h2 className="text-xl font-semibold">Thanks for your review! ☕️</h2>
        <p className="mt-2 text-gray-600">Your review helps other coffee lovers discover {roasterName}.</p>
        <Link href="/" className="mt-4 inline-flex items-center rounded-md bg-black px-4 py-2 text-white font-medium hover:bg-black/90">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Your rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`h-10 w-10 rounded-md text-lg ${rating >= n ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-500'}`}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Coffee */}
      <div>
        <label className="block text-sm font-medium mb-1">Coffee</label>
        <div className="flex flex-col gap-2">
          <select value={coffeeName} onChange={(e) => setCoffeeName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">Select coffee (optional)</option>
            {coffeeOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
            <option value="__other">Other…</option>
          </select>
          {coffeeName === '__other' && (
            <input type="text" onChange={(e) => setCoffeeName(e.target.value)} placeholder="Enter coffee name" className="w-full rounded-md border border-gray-300 px-3 py-2" />
          )}
        </div>
      </div>

      {/* Brew Method */}
      <div>
        <label className="block text-sm font-medium mb-1">Brew method (optional)</label>
        <select value={brewMethod} onChange={(e) => setBrewMethod(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
          <option value="">Select method</option>
          {BREW_METHODS.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Notes & feedback (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="What stood out about this coffee?" />
      </div>

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium mb-1">Photo (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 hover:file:bg-gray-50" />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex flex-col gap-3">
        <button type="submit" disabled={submitting} className="inline-flex h-11 items-center justify-center rounded-md bg-black px-5 text-white font-semibold hover:bg-black/90 disabled:opacity-60">
          {submitting ? 'Publishing…' : 'Publish review'}
        </button>

        {!userId && (
          <div className="rounded-md border border-gray-200 p-3">
            <p className="text-sm text-gray-700">You’ll need a free account to publish your review. Enter your email to get a magic link.</p>
            <div className="mt-2 flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-md border border-gray-300 px-3 py-2" />
              <button type="button" onClick={sendMagicLink} disabled={sendingLink} className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-60">
                {sendingLink ? 'Sending…' : 'Send link'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">By continuing, you agree to receive our coffee newsletter (unsubscribe anytime).</p>
          </div>
        )}
      </div>
    </form>
  );
}

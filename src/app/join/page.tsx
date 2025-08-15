'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function JoinPage() {
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setErr('Please enter a valid email.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: value,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });

      if (error) {
        setErr(error.message ?? 'Something went wrong.');
        return;
      }

      setSent(true);
    } catch {
      setErr('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold">Join Every Roast</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a free account. We’ll email you a secure link to sign in.
        </p>

        {sent ? (
          <div className="mt-6 rounded-md bg-green-50 text-green-800 p-3 text-sm">
            Check your inbox for a login link.
          </div>
        ) : (
          <form onSubmit={handleSend} className="mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full h-10 rounded-md bg-black text-white font-semibold hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send me a login link'}
            </button>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
            <p className="mt-3 text-xs text-gray-500">
              By continuing, you agree to receive our coffee newsletter (unsubscribe anytime).
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

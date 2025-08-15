'use client';

import { useState } from 'react';

export default function ApplyPage() {
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [err, setErr] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErr('');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch('/api/partners/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setStatus('success');
    else {
      setStatus('error');
      setErr((await res.json()).error || 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold">Thanks! 🎉</h1>
        <p className="mt-3 text-neutral-700">We received your application. We’ll email you shortly with next steps.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Apply to Partner</h1>
      <p className="mt-3 text-neutral-700">Prefer an invoice or need a W-9? Send us your details and we’ll handle it.</p>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-4">
        <input name="name" required placeholder="Your name" className="rounded-xl border px-4 py-2" />
        <input name="email" required type="email" placeholder="Email" className="rounded-xl border px-4 py-2" />
        <input name="roaster_name" required placeholder="Roaster name" className="rounded-xl border px-4 py-2" />
        <input name="website" placeholder="Website" className="rounded-xl border px-4 py-2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="address_line1" placeholder="Address line 1" className="rounded-xl border px-4 py-2" />
          <input name="address_line2" placeholder="Address line 2 (optional)" className="rounded-xl border px-4 py-2" />
          <input name="city" placeholder="City" className="rounded-xl border px-4 py-2" />
          <input name="state" placeholder="State/Province" className="rounded-xl border px-4 py-2" />
          <input name="postal_code" placeholder="Postal code" className="rounded-xl border px-4 py-2" />
          <input name="country" placeholder="Country" className="rounded-xl border px-4 py-2" />
        </div>

        <textarea name="notes" rows={4} placeholder="Anything else we should know?" className="rounded-xl border px-4 py-2" />

        <button
          disabled={status === 'submitting'}
          className="rounded-xl border px-4 py-2 hover:bg-neutral-50 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit application'}
        </button>

        {status === 'error' && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </main>
  );
}

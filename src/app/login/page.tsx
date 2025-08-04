'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border border-gray-300 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      {submitted ? (
        <p className="text-green-600">Check your email for the login link.</p>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Send Magic Link
          </button>
        </form>
      )}
    </div>
  );
}

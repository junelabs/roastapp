'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DevLogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Optional: listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-6">
      {user ? (
        <>
          <p className="mb-4">Logged in as {user.email}</p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
            Log Out
          </button>
        </>
      ) : (
        <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">
          Log In with GitHub
        </button>
      )}
    </div>
  );
}

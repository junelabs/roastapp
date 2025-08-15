'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    let unsub: (() => void) | undefined;
    (async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(!!session?.user);
      });

      unsub = () => subscription.unsubscribe();
    })();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsub) unsub();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xl sm:text-2xl text-white">Every Roast</span>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn === null ? (
            <div className="h-9 w-56 rounded-md bg-white/20 animate-pulse" />
          ) : isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-2 text-white rounded-md font-normal hover:text-gray-200 transition disabled:opacity-60"
              >
                {loggingOut ? 'Logging out…' : 'Logout'}
              </button>
              <Link
                href="/profile"
                className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-white rounded-md font-normal hover:text-gray-200 transition"
              >
                Login
              </Link>
              <Link
                href="/join"
                className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Join Every Roast →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import DropsSignupModal from '@/Components/DropsSignupModal';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [firstName, setFirstName] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState('');

  const extractFirst = (user) => {
    if (!user) return null;
    const metaName = user.user_metadata && user.user_metadata.full_name;
    if (metaName && typeof metaName === 'string') return metaName.split(' ')[0];
    const email = user.email;
    if (email && typeof email === 'string') return email.split('@')[0];
    return null;
  };

  useEffect(() => {
    let subscription;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data && data.user ? data.user : null;
      setIsLoggedIn(!!user);
      setFirstName(extractFirst(user));

      const listener = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session && session.user ? session.user : null;
        setIsLoggedIn(!!u);
        setFirstName(extractFirst(u));
      });

      subscription = listener?.data?.subscription;
    })();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    if (!email) return;
    setPrefillEmail(email);
    setModalOpen(true);
  };

  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/er-hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Left side */}
        <div className="relative z-10 max-w-4xl">
          {isLoggedIn ? (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Welcome back{firstName ? `, ${firstName}` : ''} to Every Roast.
              </h1>
              <p className="text-lg sm:text-xl mb-6 max-w-2xl">
                Pick up where you left off — discover new roasters, rate your latest coffee, or manage your favorites.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                >
                  Explore roasters
                </Link>
                <Link
                  href="/review"
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md text-white font-medium ring-1 ring-white/30 hover:bg-white/25 transition"
                >
                  Rate a coffee
                </Link>
                <Link
                  href="/my-list"
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md text-white font-medium ring-1 ring-white/30 hover:bg-white/25 transition"
                >
                  My list
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Discover the world&apos;s best coffee roasters.
              </h1>
              <p className="text-lg sm:text-xl mb-6 max-w-2xl">
                Find trusted roasters, unique coffees, and learn from in-depth profiles — all curated for true specialty coffee enthusiasts.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  🏅 Verified Roaster Profiles
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  📖 Detailed Brew Guides
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  🤝 Community Picks & Favorites
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side: Drop Alerts card (only when logged out) */}
        {isLoggedIn === false && (
          <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-sm text-gray-900 mt-10 lg:mt-0">
            <h3 className="text-lg font-semibold mb-2">Get Drop Alerts</h3>
            <p className="text-sm mb-4">
              Monthly limited releases. Be first to know when a new Drop goes live.
            </p>

            <form onSubmit={handleNotifySubmit}>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white rounded-md py-2 font-semibold hover:bg-gray-800 transition"
              >
                Join for free →
              </button>
            </form>

            <p className="text-xs mt-3 text-gray-600 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>

      <DropsSignupModal
        open={modalOpen}
        setOpen={setModalOpen}
        initialEmail={prefillEmail}
        source={prefillEmail ? 'hero' : 'hero_top_button'}
      />
    </section>
  );
}

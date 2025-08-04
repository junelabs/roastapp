'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg text-white">Every Roast</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-white hover:text-gray-200 transition font-medium px-3 py-2 rounded-md"
          >
            My List
          </a>
          <Link
  href="/login"
  className="px-4 py-2 border border-white text-white rounded-md font-medium hover:bg-white hover:text-black transition"
>
  Login
</Link>


          <Link
            href="/profile"
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
          >
            My Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

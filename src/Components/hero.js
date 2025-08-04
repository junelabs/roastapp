export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/er-hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Left side */}
        <div className="relative z-10 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Discover the world&apos;s best coffee roasters.</h1>
          <p className="text-lg sm:text-xl mb-6 max-w-2xl">
            Find trusted roasters, explore unique coffees, and learn from in-depth profiles — all curated for true coffee enthusiasts.
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
        </div>

        {/* Right side */}
        <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-sm text-gray-900 mt-10 lg:mt-0">
          <h3 className="text-lg font-semibold mb-2">Get the Roast Report</h3>
          <p className="text-sm mb-4">
            A free monthly newsletter featuring 1 roaster highlight, 2 seasonal coffees, and 3 brew tips.
          </p>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="w-full bg-black text-white rounded-md py-2 font-semibold hover:bg-gray-800 transition"
            >
              Join the list
            </button>
          </form>
          <p className="text-xs mt-3 text-gray-600 text-center">
            Enjoyed by coffee enthusiasts around the globe.
          </p>
        </div>
      </div>
    </section>
  );
}

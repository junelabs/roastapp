import { client } from '@/lib/sanity';
import Hero from '@/Components/hero';
import Navbar from '@/Components/Navbar';
import RoasterGrid from '@/Components/RoasterGrid';
import Link from 'next/link';

const ROASTERS_QUERY = `
*[_type == "roaster"]{
  _id,
  name,
  location,
  "imageUrl": coalesce(logo.asset->url, image.asset->url),
  description,
  website,
  rating,
  ratingCount,
  featured,
  top100,
  roastVolume,
  roastStyle,
  size,
  country,
  likes,
  founded,
  certifications,
  "slug": slug.current,
  cafes[]{ name, address, city, state, country, website },
  brewGuides[]->{
    _id, method, ratio, dose, yield, grind, temp, time, notes,
    steps[]{ order, text }
  }
}
`;

const FEATURED_RELEASES_QUERY = `
*[_type == "featuredCoffeeRelease"]{
  _id,
  title,
  description,
  roaster->{
    _id,
    name,
    location,
    "logoUrl": coalesce(logo.asset->url, image.asset->url),
    "imageUrl": coalesce(logo.asset->url, image.asset->url),
    website,
    rating,
    ratingCount,
    featured,
    top100,
    roastVolume,
    roastStyle,
    size,
    country,
    likes,
    founded,
    certifications,
    "slug": slug.current,
    cafes[]{ name, address, city, state, country, website },
    brewGuides[]->{
      _id, method, ratio, dose, yield, grind, temp, time, notes,
      steps[]{ order, text }
    }
  }
}
`;

async function getRatings(slugs) {
  if (!slugs?.length) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ slugs }),
  });
  if (!res.ok) {
    console.error('ratings fetch failed', await res.text());
    return {};
  }
  return await res.json(); // { [slug]: { avg, count } }
}

export default async function Home() {
  const roasters = await client.fetch(ROASTERS_QUERY);
  const featuredCoffees = await client.fetch(FEATURED_RELEASES_QUERY);

  const slugs = roasters.map(r => r.slug).filter(Boolean);
  const live = await getRatings(slugs);

  const roastersWithRatings = roasters.map(r => {
    const agg = live[r.slug];
    return {
      ...r,
      rating: typeof agg?.avg === 'number' ? agg.avg : r.rating ?? null,
      ratingCount: typeof agg?.count === 'number' ? agg.count : r.ratingCount ?? 0,
    };
  });

  const featuredRoasters = roastersWithRatings.filter((r) => r.featured);
  const nonFeaturedRoasters = roastersWithRatings.filter((r) => !r.featured);

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Navbar />
      <Hero />

      <RoasterGrid
        featuredRoasters={featuredRoasters}
        nonFeaturedRoasters={nonFeaturedRoasters}
        featuredCoffees={featuredCoffees}
      />

      <footer className="bg-gray-200 text-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Every Roast</h3>
            <p className="text-sm">
              Discover trusted roasters, explore unique coffees, and learn from curated guides — built for real coffee lovers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#featured" className="hover:underline"><span>Featured Roasters</span></Link></li>
              <li><Link href="/#releases" className="hover:underline"><span>New Releases</span></Link></li>
              <li><Link href="/#guides" className="hover:underline"><span>Brew Guides</span></Link></li>
              <li><Link href="/newsletter" className="hover:underline"><span>Newsletter</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                Email:{' '}
                <a href="mailto:hello@everyroast.com" className="hover:underline">hello@everyroast.com</a>
              </li>
              <li>
                <a href="https://instagram.com/everyroast" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com/everyroast" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pb-6">
          © {new Date().getFullYear()} Every Roast. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

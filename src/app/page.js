import { client } from '@/lib/sanity';
import Hero from '@/Components/hero';
import Navbar from '@/Components/Navbar';
import RoasterGrid from '@/Components/RoasterGrid';
import Link from 'next/link';

// (optional) Incremental Static Regeneration
// export const revalidate = 60;

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

  // Structured fields for the modal
  cafes[]{ name, address, city, state, country, website },
  brewGuides[]->{
    _id, method, ratio, dose, yield, grind, temp, time, notes,
    steps[]{ order, text }
  }

  // If you still need all coffees inline, re-enable:
  // coffees[]->
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
    // Make the roaster "modal-ready":
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
    cafes[]{ name, address, city, state, country, website },
    brewGuides[]->{
      _id, method, ratio, dose, yield, grind, temp, time, notes,
      steps[]{ order, text }
    }
  }
}
`;

export default async function Home() {
  const roasters = await client.fetch(ROASTERS_QUERY);
  const featuredCoffees = await client.fetch(FEATURED_RELEASES_QUERY);

  const featuredRoasters = roasters.filter((r) => r.featured);
  const nonFeaturedRoasters = roasters.filter((r) => !r.featured);

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

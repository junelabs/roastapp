import { notFound } from 'next/navigation';
import ReviewForm from '@/Components/ReviewForm';
import { client } from '@/lib/sanity'; // named export

export const revalidate = 0; // always fresh

type Roaster = {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coffees?: { name?: string }[];
};

async function getRoaster(slug: string): Promise<Roaster | null> {
  const query = `*[_type == "roaster" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    "logoUrl": image.asset->url,
    coffees[]->{ name }
  }`;
  return (await client.fetch(query, { slug })) as Roaster | null;
}

export default async function ReviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const roaster = await getRoaster(params.slug);
  if (!roaster?._id) notFound();

  const coffeeOptions: string[] = Array.isArray(roaster.coffees)
    ? (roaster.coffees.map((c) => c?.name).filter(Boolean) as string[])
    : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center gap-4">
        {roaster.logoUrl ? (
          <img
            src={roaster.logoUrl}
            alt={roaster.name}
            className="h-12 w-12 rounded-md object-cover bg-white"
          />
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold">Review {roaster.name}</h1>
          <p className="text-sm text-gray-600">
            Share your experience and help other coffee lovers discover great
            roasts.
          </p>
        </div>
      </div>

      <ReviewForm
        roasterId={roaster._id}
        roasterSlug={roaster.slug}
        roasterName={roaster.name}
        coffeeOptions={coffeeOptions}
      />
    </main>
  );
}

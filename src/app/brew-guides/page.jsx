import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import { allBrewGuides } from '@/lib/queries/brewGuides'

function cToF(c) { return Math.round((c * 9) / 5 + 32) }
function labelMethod(m) {
  const map = { v60:'V60', kalita:'Kalita', aeropress:'AeroPress', espresso:'Espresso',
    french_press:'French Press', chemex:'Chemex', batch:'Batch Brewer', moka:'Moka Pot', other:'Other' }
  return map[m] || m
}

export const revalidate = 60

export default async function BrewGuidesIndex() {
  const guides = await client.fetch(allBrewGuides)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Brew Guides</h1>

      {!guides?.length ? (
        <p className="text-neutral-500">No brew guides yet.</p>
      ) : (
        <ul className="space-y-4">
          {guides.map(g => (
            <li key={g._id} className="rounded-2xl border p-4 flex items-start gap-4">
              <div className="shrink-0">
                {g?.roaster?.imageUrl ? (
                  <Image
                    src={g.roaster.imageUrl}
                    alt={g.roaster.name}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-neutral-100" />
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm text-neutral-600">{g?.roaster?.name}</div>
                <div className="text-base font-medium mt-0.5">
                  {labelMethod(g.method)} • {g.ratio} • {g.dose}g → {g?.yield?.value}{g?.yield?.unit} • {g.timeTotal}
                </div>
                <div className="text-xs text-neutral-600 mt-1">
                  {g.grind?.text ? `Grind: ${g.grind.text} • ` : ''}
                  {typeof g.tempC === 'number' ? `Temp: ${g.tempC}°C / ${cToF(g.tempC)}°F` : ''}
                </div>

                {/* TODO: If you want this to open your modal directly, replace href below with your modal trigger. */}
                <div className="mt-2">
                  <Link href="/" className="text-xs underline">Open roaster</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

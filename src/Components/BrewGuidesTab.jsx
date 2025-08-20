'use client'
import { useEffect, useState } from 'react'

function cToF(c) { return Math.round((c * 9) / 5 + 32) }
function labelMethod(m) {
  const map = {
    v60: 'V60',
    kalita: 'Kalita',
    aeropress: 'AeroPress',
    espresso: 'Espresso',
    french_press: 'French Press',
    chemex: 'Chemex',
    batch: 'Batch Brewer',
    moka: 'Moka Pot',
    other: 'Other',
  }
  return map[m] || m
}

export default function BrewGuidesTab({ roasterId }) {
  const [loading, setLoading] = useState(true)
  const [guides, setGuides] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    let ignore = false
    async function run() {
      try {
        setLoading(true)
        const res = await fetch(`/api/guides/by-roaster/${roasterId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        if (!ignore) setGuides(json.guides || [])
      } catch (e) {
        if (!ignore) setErr('Could not load brew guides.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (roasterId) run()
    return () => { ignore = true }
  }, [roasterId])

  if (loading) return <div className="text-sm text-neutral-500 py-6">Loading brew guides…</div>
  if (err) return <div className="text-sm text-red-600 py-6">{err}</div>
  if (!guides.length) return <div className="text-sm text-neutral-500 py-6">No brew guides yet.</div>

  return (
    <div className="divide-y divide-neutral-200">
      {guides.map(g => (
        <div key={g._id} className="py-4 flex items-start gap-4">
          <span className="shrink-0 inline-block rounded-full px-3 py-1 text-xs border">
            {labelMethod(g.method)}
          </span>

          <div className="flex-1">
            <div className="text-sm font-medium">
              {g.ratio} • {g.dose}g → {g?.yield?.value}{g?.yield?.unit} • {g.timeTotal}
            </div>

            <div className="text-xs text-neutral-600 mt-1">
              {g.grind?.text ? `Grind: ${g.grind.text} • ` : ''}
              {typeof g.tempC === 'number' ? `Temp: ${g.tempC}°C / ${cToF(g.tempC)}°F` : ''}
            </div>

            {Array.isArray(g.steps) && g.steps.length > 0 && (
              <ol className="mt-2 text-sm list-decimal list-inside space-y-1">
                {g.steps.slice(0, 3).map((s, i) => (
                  <li key={i}>
                    {s.text}{s.at ? ` @ ${s.at}` : ''}{typeof s.targetMass === 'number' ? ` → ${s.targetMass}g` : ''}
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-2 flex items-center gap-3">
              <button
                className="text-xs underline"
                onClick={() => alert('Full guide view coming soon')}
              >
                View full guide
              </button>
              {g.sourceUrl && (
                <a href={g.sourceUrl} target="_blank" rel="noreferrer" className="text-xs underline">
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

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
    <div className="grid gap-6 sm:grid-cols-2">
      {guides.map(g => (
        <div
          key={g._id}
          className="rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition"
        >
          {/* Header row */}
          <div className="flex items-center gap-3">
            <span className="shrink-0 inline-block rounded-full px-3 py-1 text-xs font-medium border bg-neutral-50">
              {labelMethod(g.method)}
            </span>
            <div className="text-sm font-medium text-neutral-800">
              {g.ratio && <span>{g.ratio}</span>}
              {g.dose && <> • {g.dose}g</>}
              {g?.yield?.value && (
                <> → {g.yield.value}{g.yield.unit}</>
              )}
              {g.timeTotal && <> • {g.timeTotal}</>}
            </div>
          </div>

          {/* Metadata */}
          {(g.grind?.text || typeof g.tempC === 'number') && (
            <div className="mt-2 text-xs text-neutral-600">
              {g.grind?.text && `Grind: ${g.grind.text}`}
              {g.grind?.text && typeof g.tempC === 'number' && ' • '}
              {typeof g.tempC === 'number' && `Temp: ${g.tempC}°C / ${cToF(g.tempC)}°F`}
            </div>
          )}

          {/* Steps */}
          {Array.isArray(g.steps) && g.steps.length > 0 && (
            <ol className="mt-4 space-y-1 text-sm text-neutral-800 list-decimal list-inside">
              {g.steps.slice(0, 3).map((s, i) => (
                <li key={i}>
                  {s.text}
                  {s.at ? ` @ ${s.at}` : ''}
                  {typeof s.targetMass === 'number' ? ` → ${s.targetMass}g` : ''}
                </li>
              ))}
              {g.steps.length > 3 && (
                <li className="italic text-neutral-500">…more steps</li>
              )}
            </ol>
          )}

          {/* Footer actions */}
          <div className="mt-4 flex items-center gap-4">
            <button
              className="text-xs font-medium text-blue-600 hover:underline"
              onClick={() => alert('Full guide view coming soon')}
            >
              View full guide →
            </button>
            {g.sourceUrl && (
              <a
                href={g.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-neutral-600 hover:underline"
              >
                Source
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

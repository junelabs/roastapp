import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

const GUIDE_FIELDS = `
  _id, method, ratio, dose, yield, grind, tempC, timeTotal, steps,
  editorStatus, sourceUrl,
  "roaster": roaster->{ _id, name, "imageUrl": image.asset->url }
`

const roasterArraysQuery = `
*[_type=="roaster" && _id in [$roasterId,$publishedId]][0]{
  "guidesA": guides[]->{
    ${GUIDE_FIELDS}
  },
  "guidesB": brewGuides[]->{
    ${GUIDE_FIELDS}
  }
}
`

const reverseLookupQuery = `
*[
  _type=="brewGuide" &&
  archived != true &&
  (
    references([$roasterId,$publishedId]) ||
    roaster._ref in [$roasterId,$publishedId] ||
    roasterRef in [$roasterId,$publishedId]
  )
]{
  ${GUIDE_FIELDS}
}
`

export async function GET(_req, { params }) {
  try {
    const { id } = params || {}
    if (!id) return NextResponse.json({ guides: [] }, { status: 200 })

    const publishedId = id.startsWith('drafts.') ? id.slice('drafts.'.length) : id

    // fetch both sources in parallel
    const [fromRoaster, fromReverse] = await Promise.all([
      client.fetch(roasterArraysQuery, { roasterId: id, publishedId }),
      client.fetch(reverseLookupQuery, { roasterId: id, publishedId }),
    ])

    const arrA = fromRoaster?.guidesA || []
    const arrB = fromRoaster?.guidesB || []
    const arrR = Array.isArray(fromReverse) ? fromReverse : []

    // merge + de-dupe by _id
    const byId = new Map()
    ;[...arrA, ...arrB, ...arrR].forEach(g => {
      if (g?._id) byId.set(g._id, g)
    })
    const merged = Array.from(byId.values())

    // sort: method asc, changedAt desc if present, else by _id for stability
    merged.sort((a, b) => {
      const ma = (a.method || '').localeCompare(b.method || '')
      if (ma !== 0) return ma
      const ca = a.changedAt ? new Date(a.changedAt).getTime() : 0
      const cb = b.changedAt ? new Date(b.changedAt).getTime() : 0
      return cb - ca || String(a._id).localeCompare(String(b._id))
    })

    return NextResponse.json({ guides: merged })
  } catch (err) {
    console.error('Guides API error:', err)
    return NextResponse.json({ guides: [], error: 'fail' }, { status: 500 })
  }
}

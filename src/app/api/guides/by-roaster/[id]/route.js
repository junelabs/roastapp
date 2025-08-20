import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { guidesForRoaster } from '@/lib/queries/brewGuides'

export async function GET(_req, { params }) {
  try {
    const { id } = params || {}
    if (!id) return NextResponse.json({ guides: [] }, { status: 200 })

    const guides = await client.fetch(guidesForRoaster, { roasterId: id })
    return NextResponse.json({ guides })
  } catch (err) {
    console.error('Guides API error:', err)
    return NextResponse.json({ guides: [], error: 'fail' }, { status: 500 })
  }
}

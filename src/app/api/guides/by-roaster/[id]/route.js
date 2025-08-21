import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET(_req, { params }) {
  const { id } = params || {}
  const publishedId = id?.startsWith('drafts.') ? id.slice('drafts.'.length) : id
  const ids = [id, publishedId].filter(Boolean)

  const [countReferences, countDirectRef, countStringRef, sample] = await Promise.all([
    client.fetch('count(*[_type=="brewGuide" && references($ids)])', { ids }),
    client.fetch('count(*[_type=="brewGuide" && roaster._ref in $ids])', { ids }),
    client.fetch('count(*[_type=="brewGuide" && roasterRef in $ids])', { ids }),
    client.fetch('*[_type=="brewGuide"][0]{_id, roaster, roasterRef, roasterId, _type}')
  ])

  return NextResponse.json({
    idsTried: ids,
    counts: { references: countReferences, roasterDotRef: countDirectRef, roasterRef: countStringRef },
    sample
  })
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const slugs = Array.isArray(body?.slugs) ? body.slugs : [];
    if (!slugs.length) {
      return NextResponse.json({ error: 'No slugs provided' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('roaster_slug,rating')
      .in('roaster_slug', slugs);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const map = new Map();
    for (const r of data ?? []) {
      const m = map.get(r.roaster_slug) ?? { sum: 0, count: 0 };
      m.sum += Number(r.rating) || 0;
      m.count += 1;
      map.set(r.roaster_slug, m);
    }
    const result = {};
    for (const s of slugs) {
      const m = map.get(s);
      result[s] = m ? { avg: Number((m.sum / m.count).toFixed(2)), count: m.count } : { avg: null, count: 0 };
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env (URL or SERVICE_ROLE_KEY).');
  }
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const { slugs } = (await req.json()) as { slugs: string[] };
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({ error: 'No slugs provided' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('roaster_slug,rating')
      .in('roaster_slug', slugs);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const map = new Map<string, { sum: number; count: number }>();
    for (const r of data ?? []) {
      const m = map.get(r.roaster_slug) ?? { sum: 0, count: 0 };
      m.sum += Number(r.rating) || 0;
      m.count += 1;
      map.set(r.roaster_slug, m);
    }

    const result: Record<string, { avg: number | null; count: number }> = {};
    for (const s of slugs) {
      const m = map.get(s);
      result[s] = m ? { avg: Number((m.sum / m.count).toFixed(2)), count: m.count } : { avg: null, count: 0 };
    }

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

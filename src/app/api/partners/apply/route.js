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
    const body = await req.json();

    const required = ['name', 'email', 'roaster_name'];
    for (const k of required) {
      if (!body?.[k] || String(body[k]).trim() === '') {
        return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
      }
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 });
    }

    const { error } = await supabase.from('partner_applications').insert({
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      roaster_name: String(body.roaster_name).trim(),
      website: body.website || null,
      address_line1: body.address_line1 || null,
      address_line2: body.address_line2 || null,
      city: body.city || null,
      state: body.state || null,
      postal_code: body.postal_code || null,
      country: body.country || null,
      notes: body.notes || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

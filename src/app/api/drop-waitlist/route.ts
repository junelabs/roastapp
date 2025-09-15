import { NextResponse } from "next/server";

// If you already have a Supabase server client util, use it instead of direct fetch.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const { email, full_name, birthday, source, utm } = await req.json();

    if (!email) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });

    // insert
    const res = await fetch(`${SUPABASE_URL}/rest/v1/drop_waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify([{ email, full_name, birthday, source, utm }])
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ ok: false, error: txt }, { status: 500 });
    }

    // TODO (optional): forward to Klaviyo/Beehiiv here.

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

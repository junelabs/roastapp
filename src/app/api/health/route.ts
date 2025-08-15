import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSrk = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return NextResponse.json({
    ok: hasUrl && hasSrk,
    NEXT_PUBLIC_SUPABASE_URL: hasUrl,
    SUPABASE_SERVICE_ROLE_KEY: hasSrk,
    env: process.env.VERCEL_ENV || 'local',
  });
}

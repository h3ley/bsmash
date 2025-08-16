import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const now = new Date();
  const until = new Date(Date.now() + 7 * 86400000);
  const { data: courts } = await supabaseServer
    .from("courts")
    .select("id")
    .eq("venue_id", params.id);
  const { data: slots } = await supabaseServer
    .from("slots")
    .select("*")
    .in("court_id", courts?.map((c) => c.id) ?? [])
    .gte("start_at", now.toISOString())
    .lt("start_at", until.toISOString())
    .order("start_at");
  return NextResponse.json({ ok: true, slots });
}

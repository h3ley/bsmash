import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const {
    title,
    venue_id,
    court_id,
    start_at,
    end_at,
    capacity,
    price_per_person,
  } = await req.json();
  if (!title || !venue_id || !court_id || !start_at || !end_at || !capacity)
    return NextResponse.json(
      { ok: false, error: "ข้อมูลไม่ครบ" },
      { status: 400 }
    );
  const { data: upd } = await supabaseServer
    .from("slots")
    .update({ status: "BLOCKED", block_reason: "EVENT" })
    .eq("court_id", court_id)
    .eq("start_at", start_at)
    .eq("end_at", end_at)
    .eq("status", "OPEN")
    .select("id")
    .limit(1);
  if (!upd?.length)
    return NextResponse.json(
      { ok: false, error: "ช่วงเวลานี้ไม่ว่างแล้ว" },
      { status: 409 }
    );
  const { data: ev, error } = await supabaseServer
    .from("events")
    .insert({
      title,
      venue_id,
      court_id,
      start_at,
      end_at,
      capacity,
      price_per_person,
    })
    .select("id")
    .single();
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true, event_id: ev.id });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { ok: false, error: "missing id" },
      { status: 400 }
    );
  const { data: event } = await supabaseServer
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (!event)
    return NextResponse.json(
      { ok: false, error: "not found" },
      { status: 404 }
    );
  return NextResponse.json({ ok: true, event });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const event_id = Number(params.id);
  // เช็กความจุอย่างง่าย (MVP)
  const { data: ev } = await supabaseServer
    .from("events")
    .select("id, capacity")
    .eq("id", event_id)
    .single();
  if (!ev)
    return NextResponse.json({ ok: false, error: "ไม่พบรอบ" }, { status: 404 });
  const { data: regs } = await supabaseServer
    .from("event_regs")
    .select("id")
    .eq("event_id", event_id)
    .eq("status", "CONFIRMED");
  if ((regs?.length ?? 0) >= ev.capacity)
    return NextResponse.json({ ok: false, error: "เต็มแล้ว" }, { status: 409 });
  const { error } = await supabaseServer
    .from("event_regs")
    .insert({ event_id, user_id: null, status: "CONFIRMED", paid: "UNPAID" });
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function POST(req: NextRequest) {
  const { booking_id } = await req.json();
  const { data: bk } = await supabaseServer
    .from("bookings")
    .select("id, slot_id, status")
    .eq("id", booking_id)
    .single();
  if (!bk)
    return NextResponse.json(
      { ok: false, error: "ไม่พบการจอง" },
      { status: 404 }
    );
  await supabaseServer
    .from("bookings")
    .update({ status: "CANCELLED" })
    .eq("id", booking_id);
  await supabaseServer
    .from("slots")
    .update({ status: "OPEN" })
    .eq("id", bk.slot_id)
    .eq("status", "PENDING");
  return NextResponse.json({ ok: true });
}

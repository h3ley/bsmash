import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function POST(req: NextRequest) {
  const { booking_id, slip_url } = await req.json();
  if (!booking_id)
    return NextResponse.json(
      { ok: false, error: "booking_id required" },
      { status: 400 }
    );

  // อ่าน booking + slot
  const { data: bk } = await supabaseServer
    .from("bookings")
    .select("id, slot_id, status, payment_status")
    .eq("id", booking_id)
    .single();
  if (!bk)
    return NextResponse.json(
      { ok: false, error: "ไม่พบการจอง" },
      { status: 404 }
    );

  // อัปเดต booking เป็น CONFIRMED/PAID
  const { error: bErr } = await supabaseServer
    .from("bookings")
    .update({ status: "CONFIRMED", payment_status: "PAID", slip_url })
    .eq("id", booking_id);
  if (bErr)
    return NextResponse.json(
      { ok: false, error: bErr.message },
      { status: 500 }
    );

  // อัปเดต slot เป็น BOOKED เฉพาะถ้ายัง PENDING
  const { error: sErr } = await supabaseServer
    .from("slots")
    .update({ status: "BOOKED" })
    .eq("id", bk.slot_id)
    .eq("status", "PENDING");
  if (sErr)
    return NextResponse.json(
      { ok: false, error: sErr.message },
      { status: 500 }
    );

  return NextResponse.json({ ok: true });
}

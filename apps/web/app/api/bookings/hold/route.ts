import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const { slot_id } = await req.json();
  if (!slot_id)
    return NextResponse.json(
      { ok: false, error: "slot_id required" },
      { status: 400 }
    );

  // 1) ล็อกสลอตเป็น PENDING ถ้ายัง OPEN (atomic at row level)
  const { data: updated, error: upErr } = await supabaseServer
    .from("slots")
    .update({ status: "PENDING" })
    .eq("id", slot_id)
    .eq("status", "OPEN")
    .select("id")
    .limit(1);
  if (upErr || !updated?.length)
    return NextResponse.json(
      { ok: false, error: "สลอตถูกจองไปแล้ว" },
      { status: 409 }
    );

  // 2) สร้าง booking (ผูก user_id=anonymous/null ใน MVP; ภายหลังใส่ auth)
  const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { data: booking, error: bkErr } = await supabaseServer
    .from("bookings")
    .insert({
      user_id: null,
      slot_id,
      status: "PENDING",
      payment_status: "UNPAID",
      hold_expires_at: holdExpiresAt,
    })
    .select("id")
    .single();
  if (bkErr)
    return NextResponse.json(
      { ok: false, error: bkErr.message },
      { status: 500 }
    );

  return NextResponse.json({
    ok: true,
    booking_id: booking.id,
    hold_expires_at: holdExpiresAt,
  });
}

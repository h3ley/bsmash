import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );

  const { slot_id } = await req.json();
  if (!slot_id)
    return NextResponse.json(
      { ok: false, error: "slot_id required" },
      { status: 400 }
    );

  // จอง hold สลอต (ต้องเปิด RLS ให้เลือก/อัปเดต slot ได้ หรือใช้ rpc/secured)
  const { data: upd, error: e1 } = await supabase
    .from("slots")
    .update({ status: "PENDING" })
    .eq("id", slot_id)
    .eq("status", "OPEN")
    .select("id")
    .limit(1);

  if (e1)
    return NextResponse.json({ ok: false, error: e1.message }, { status: 500 });
  if (!upd?.length)
    return NextResponse.json(
      { ok: false, error: "Slot not OPEN" },
      { status: 409 }
    );

  const holdUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const { data: bk, error: e2 } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      slot_id,
      status: "PENDING",
      payment_status: "UNPAID",
      hold_expires_at: holdUntil,
    })
    .select("id")
    .single();

  if (e2)
    return NextResponse.json({ ok: false, error: e2.message }, { status: 500 });
  return NextResponse.json({ ok: true, booking_id: bk.id });
}

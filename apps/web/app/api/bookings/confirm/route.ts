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

  const { booking_id, slip_url } = await req.json();
  if (!booking_id)
    return NextResponse.json(
      { ok: false, error: "booking_id required" },
      { status: 400 }
    );

  const { data: bk, error: e0 } = await supabase
    .from("bookings")
    .select("id, slot_id, status, hold_expires_at, user_id")
    .eq("id", booking_id)
    .single();
  if (e0)
    return NextResponse.json({ ok: false, error: e0.message }, { status: 500 });
  if (!bk)
    return NextResponse.json(
      { ok: false, error: "not found" },
      { status: 404 }
    );
  if (bk.user_id !== user.id)
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  if (bk.status !== "PENDING")
    return NextResponse.json(
      { ok: false, error: "not pending" },
      { status: 409 }
    );
  if (bk.hold_expires_at && new Date(bk.hold_expires_at) < new Date()) {
    await supabase
      .from("slots")
      .update({ status: "OPEN" })
      .eq("id", bk.slot_id)
      .eq("status", "PENDING");
    return NextResponse.json(
      { ok: false, error: "hold expired" },
      { status: 409 }
    );
  }

  const { error: e1 } = await supabase
    .from("slots")
    .update({ status: "BOOKED" })
    .eq("id", bk.slot_id)
    .eq("status", "PENDING");
  if (e1)
    return NextResponse.json({ ok: false, error: e1.message }, { status: 500 });

  const { error: e2 } = await supabase
    .from("bookings")
    .update({
      status: "CONFIRMED",
      payment_status: slip_url ? "PAID" : "UNPAID",
      slip_url: slip_url ?? null,
      hold_expires_at: null,
    })
    .eq("id", booking_id);
  if (e2)
    return NextResponse.json({ ok: false, error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

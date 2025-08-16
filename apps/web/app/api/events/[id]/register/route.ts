import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );

  const eventId = Number(params.id);
  const { data: ev, error: e0 } = await supabase
    .from("events")
    .select("id, capacity")
    .eq("id", eventId)
    .single();
  if (e0)
    return NextResponse.json({ ok: false, error: e0.message }, { status: 500 });
  if (!ev)
    return NextResponse.json(
      { ok: false, error: "event not found" },
      { status: 404 }
    );

  const { count } = await supabase
    .from("event_regs")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  if ((count ?? 0) >= ev.capacity)
    return NextResponse.json(
      { ok: false, error: "event full" },
      { status: 409 }
    );

  const { data: reg, error } = await supabase
    .from("event_regs")
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: "CONFIRMED",
      paid: "UNPAID",
    })
    .select("id")
    .single();

  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true, reg_id: reg.id });
}

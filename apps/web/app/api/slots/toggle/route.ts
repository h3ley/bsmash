import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const { slot_id, status } = await req.json();
  if (!slot_id || !status)
    return NextResponse.json(
      { ok: false, error: "missing params" },
      { status: 400 }
    );
  if (!["OPEN", "BLOCKED"].includes(status))
    return NextResponse.json(
      { ok: false, error: "invalid status" },
      { status: 400 }
    );
  const { error } = await supabaseServer
    .from("slots")
    .update({ status })
    .eq("id", slot_id)
    .neq("status", "BOOKED");
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true });
}

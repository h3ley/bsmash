import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { reg_id, slip_url } = await req.json();
  await supabaseServer
    .from("event_regs")
    .update({ paid: "PAID", slip_url })
    .eq("id", reg_id);
  return NextResponse.json({ ok: true });
}

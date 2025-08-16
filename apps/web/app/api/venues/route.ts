import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export async function GET() {
  const { data, error } = await supabaseServer
    .from("venues")
    .select("id,name,address");
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true, venues: data });
}

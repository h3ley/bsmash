import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // เฉพาะ ADMIN เท่านั้น
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (prof?.role !== "ADMIN")
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("user_id, display_name, role")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true, profiles: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { user_id, role }: { user_id?: string; role?: string } = await req
    .json()
    .catch(() => ({}));
  if (!user_id || !role)
    return NextResponse.json(
      { ok: false, error: "missing params" },
      { status: 400 }
    );

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (prof?.role !== "ADMIN")
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ role })
    .eq("user_id", user_id);
  if (error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true });
}

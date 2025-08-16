import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default async function MyGroupsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <main className="p-4">กรุณาเข้าสู่ระบบ</main>;

  const { data: regs, error } = await supabase
    .from("event_regs")
    .select(
      "id,status,paid,slip_url,event_id, events(id,title,start_at,end_at)"
    )
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error)
    return (
      <main className="p-4">
        <pre className="text-xs">{error.message}</pre>
      </main>
    );
  if (!regs?.length)
    return (
      <main className="p-4 space-y-3">
        <h1 className="text-xl font-bold">ก๊วนของฉัน</h1>
        <p className="text-sm text-neutral-600">ยังไม่มีรายการ</p>
        <p className="text-sm">
          ไปที่{" "}
          <Link className="underline" href="/events">
            /events
          </Link>{" "}
          เพื่อสมัครเข้าร่วม
        </p>
      </main>
    );

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">ก๊วนของฉัน</h1>
      <div className="space-y-3">
        {regs.map((r: any) => (
          <div key={r.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {r.events?.title ?? `Event #${r.event_id}`}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  r.paid === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {r.paid || "UNPAID"}
              </span>
            </div>
            <div className="text-sm text-neutral-600">
              {r.events?.start_at &&
                new Date(r.events.start_at).toLocaleString("th-TH")}
              {r.events?.end_at &&
                " – " + new Date(r.events.end_at).toLocaleString("th-TH")}
            </div>
            <div className="text-xs text-neutral-500 mt-1">Reg #{r.id}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

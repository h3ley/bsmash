import { supabaseServer } from "@/lib/supabaseServer";
import { AvailabilityTable } from "@/components/AvailabilityTable";
export default async function VenuePage({
  params,
}: {
  params: { id: string };
}) {
  const { data: venue } = await supabaseServer
    .from("venues")
    .select("*")
    .eq("id", params.id)
    .single();
  const { data: courts } = await supabaseServer
    .from("courts")
    .select("*")
    .eq("venue_id", params.id)
    .order("court_no");
  const { data: slots } = await supabaseServer
    .from("slots")
    .select("*")
    .in("court_id", courts?.map((c) => c.id) ?? [])
    .gte("start_at", new Date().toISOString())
    .lte("start_at", new Date(Date.now() + 7 * 86400000).toISOString())
    .order("start_at");
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">{venue?.name}</h1>
      <p className="text-sm text-neutral-600">
        คอร์ททั้งหมด: {courts?.length ?? 0}
      </p>
      <AvailabilityTable slots={slots ?? []} />
    </main>
  );
}

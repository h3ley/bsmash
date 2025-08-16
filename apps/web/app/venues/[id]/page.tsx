import { supabaseServer } from '@/lib/supabaseServer'
import { AvailabilityTable } from '@/components/AvailabilityTable'

export default async function VenuePage({ params }: { params: { id: string } }) {
  const { data: venue } = await supabaseServer.from('venues').select('*').eq('id', params.id).single()
  const { data: courts } = await supabaseServer.from('courts').select('id,court_no').eq('venue_id', params.id).order('court_no')
  const now = new Date(); const until = new Date(Date.now()+7*86400000)
  const courtIds = courts?.map(c=>c.id) ?? []
  const { data: slots } = await supabaseServer
    .from('slots')
    .select('id,court_id,start_at,end_at,status')
    .in('court_id', courtIds)
    .gte('start_at', now.toISOString())
    .lt('start_at', until.toISOString())
    .order('start_at')
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">{venue?.name}</h1>
      <p className="text-sm text-neutral-600">คอร์ททั้งหมด: {courts?.length ?? 0}</p>
      <div className="rounded-xl border p-3">
        <AvailabilityTable slots={slots ?? []} />
      </div>
    </main>
  )
}
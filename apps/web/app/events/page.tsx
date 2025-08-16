import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function EventsPage() {
  const { data: events } = await supabaseServer
    .from('events')
    .select('id,title,start_at,end_at,capacity,status')
    .order('start_at', { ascending: true })
    .gte('start_at', new Date().toISOString())

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">รอบก๊วน</h1>
      <div className="space-y-2">
        {events?.map(e => (
          <Link key={e.id} href={`/events/${e.id}`} className="block rounded-xl border p-4 hover:bg-neutral-50">
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-neutral-600">{new Date(e.start_at).toLocaleString('th-TH')} – {new Date(e.end_at).toLocaleString('th-TH')}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
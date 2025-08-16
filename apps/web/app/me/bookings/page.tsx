// apps/web/app/me/bookings/page.tsx
import { supabaseServer } from '@/lib/supabaseServer'

export default async function MyBookings() {
  const { data: rows, error } = await supabaseServer
    .from('bookings')
    .select('id,status,payment_status,created_at, slots(start_at,end_at)')
    .order('id', { ascending: false })
    .limit(20)

  if (error) return <main className="p-4"><pre>{error.message}</pre></main>

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">การจองล่าสุด</h1>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">เลขที่</th><th>เวลา</th><th>สถานะ</th></tr></thead>
        <tbody>
          {(rows ?? []).map((b:any) => (
            <tr key={b.id} className="border-b">
              <td>#{b.id}</td>
              <td>
                {b.slots?.start_at && new Date(b.slots.start_at).toLocaleString('th-TH')}
                {b.slots?.end_at && ' – ' + new Date(b.slots.end_at).toLocaleString('th-TH')}
              </td>
              <td><span className="px-2 py-0.5 rounded-full text-xs bg-neutral-200">{b.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

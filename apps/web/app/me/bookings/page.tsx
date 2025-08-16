// apps/web/app/me/bookings/page.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function MyBookings() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main className="p-4">กรุณาเข้าสู่ระบบ</main>

  const { data: rows, error } = await supabase
    .from('bookings')
    .select('id,status,payment_status,created_at, slots(start_at,end_at)')
    .eq('user_id', user.id)
    .order('id', { ascending: false })
    .limit(20)

  if (error) return <main className="p-4"><pre className="text-xs">{error.message}</pre></main>

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">การจองของฉัน</h1>
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

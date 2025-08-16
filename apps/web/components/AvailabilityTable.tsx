'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AvailabilityTable({ slots }: { slots: { id: number; start_at: string; end_at: string; status: string }[] }) {
  const [loading, setLoading] = useState<number | null>(null)
  const router = useRouter()
  const book = async (slotId: number) => {
    setLoading(slotId)
    const r = await fetch('/api/bookings/hold', { method: 'POST', body: JSON.stringify({ slot_id: slotId }) })
    const j = await r.json()
    setLoading(null)
    if (j.ok) router.push(`/book?booking=${j.booking_id}`)
    else alert(j.error)
  }
  return (
    <table className="w-full text-sm">
      <thead><tr><th className="text-left">เวลา</th><th>สถานะ</th><th></th></tr></thead>
      <tbody>
        {slots.map(s => (
          <tr key={s.id} className="border-b">
            <td>{new Date(s.start_at).toLocaleString('th-TH')}</td>
            <td><span className={`px-2 py-0.5 rounded-full text-xs ${s.status==='OPEN'?'bg-green-100 text-green-700':s.status==='PENDING'?'bg-amber-100 text-amber-700':'bg-neutral-200 text-neutral-700'}`}>{s.status}</span></td>
            <td className="text-right">
              {s.status === 'OPEN' && (
                <button onClick={() => book(s.id)} className="px-3 py-1.5 rounded-lg bg-black text-white disabled:opacity-50" disabled={loading===s.id}>
                  {loading===s.id ? 'กำลังจอง...' : 'จอง'}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
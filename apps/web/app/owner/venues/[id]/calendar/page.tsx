'use client'
import { useEffect, useState } from 'react'

export default function OwnerCalendar({ params }: { params: { id: string } }) {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch(`/api/venues/${params.id}/availability`)
    const j = await r.json(); setSlots(j.slots||[])
  }
  useEffect(() => { load() }, [])

  async function toggle(slotId: number, next: 'OPEN'|'BLOCKED') {
    setLoading(true)
    const r = await fetch('/api/slots/toggle', { method: 'POST', body: JSON.stringify({ slot_id: slotId, status: next }) })
    const j = await r.json(); setLoading(false)
    if (j.ok) load(); else alert(j.error)
  }

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">จัดการสลอต</h1>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">เวลา</th><th>สถานะ</th><th></th></tr></thead>
        <tbody>
          {slots.map(s => (
            <tr key={s.id} className="border-b">
              <td>{new Date(s.start_at).toLocaleString('th-TH')}</td>
              <td>{s.status}</td>
              <td className="text-right">
                {s.status !== 'BOOKED' && (
                  <button
                    onClick={() => toggle(s.id, s.status==='BLOCKED' ? 'OPEN' : 'BLOCKED')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white disabled:opacity-50">
                    {s.status==='BLOCKED' ? 'ปลดบล็อก' : 'บล็อก'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
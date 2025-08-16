'use client'
import { useEffect, useState } from 'react'

export default function OrganizerEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [regs, setRegs] = useState<Record<number, any[]>>({})

  useEffect(() => { (async()=>{
    const r = await fetch('/api/events-list'); const j = await r.json(); setEvents(j.events||[])
  })() }, [])

  async function loadRegs(id: number) {
    const r = await fetch(`/api/events-regs?id=${id}`); const j = await r.json(); setRegs(prev => ({...prev, [id]: j.regs||[]}))
  }

  async function confirm(regId: number) {
    await fetch(`/api/events/${regId}/confirm-payment`, { method: 'POST', body: JSON.stringify({ reg_id: regId }) })
    // refresh regs (simplified)
    const evId = Number(Object.entries(regs).find(([_, arr]) => (arr as any[]).some((x:any)=>x.id===regId))?.[0])
    if (evId) loadRegs(evId)
  }

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">ก๊วนของฉัน</h1>
      <div className="space-y-3">
        {events.map(e => (
          <div key={e.id} className="rounded-xl border p-4">
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-neutral-600">{new Date(e.start_at).toLocaleString('th-TH')}</div>
            <button onClick={()=>loadRegs(e.id)} className="mt-2 text-sm px-3 py-1.5 rounded-lg bg-neutral-200">โหลดรายชื่อ</button>
            <div className="mt-2 space-y-1">
              {(regs[e.id]||[]).map((r:any)=>(
                <div key={r.id} className="flex items-center justify-between rounded border p-2">
                  <div>Reg #{r.id} — {r.status} — {r.paid}</div>
                  {r.paid!=='PAID' && <button onClick={()=>confirm(r.id)} className="px-3 py-1.5 rounded bg-black text-white">ยืนยันรับเงิน</button>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
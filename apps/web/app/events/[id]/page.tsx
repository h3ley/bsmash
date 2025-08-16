'use client'
import { useEffect, useState } from 'react'

async function fetchEvent(id: string) {
  const r = await fetch(`/api/events?id=${id}`, { cache: 'no-store' })
  return r.json()
}

export default function EventDetail({ params }: { params: { id: string } }) {
  const [ev, setEv] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => { (async()=>{ const r = await fetch('/api/events?id='+params.id); const j = await r.json(); setEv(j.event) })() }, [params.id])

  const register = async () => {
    setLoading(true)
    const r = await fetch(`/api/events/${params.id}/register`, { method: 'POST' })
    const j = await r.json(); setLoading(false)
    alert(j.ok ? 'สมัครสำเร็จ' : j.error)
  }

  if (!ev) return <main className="p-4">กำลังโหลด…</main>
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">{ev.title}</h1>
      <div className="text-sm text-neutral-600">{new Date(ev.start_at).toLocaleString('th-TH')} – {new Date(ev.end_at).toLocaleString('th-TH')}</div>
      <button onClick={register} disabled={loading} className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50">
        {loading? 'กำลังสมัคร…' : 'สมัครเข้าร่วม'}
      </button>
    </main>
  )
}
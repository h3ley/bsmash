'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function BookPage() {
  const sp = useSearchParams(); const router = useRouter()
  const bookingId = sp.get('booking')
  const [slipUrl, setSlipUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!bookingId) router.replace('/'); }, [bookingId, router])

  const submit = async () => {
    if (!bookingId) return
    setSaving(true)
    const r = await fetch('/api/bookings/confirm', { method: 'POST', body: JSON.stringify({ booking_id: Number(bookingId), slip_url: slipUrl }) })
    const j = await r.json(); setSaving(false)
    if (j.ok) router.push('/me/bookings')
    else alert(j.error)
  }
  return (
    <main className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">ยืนยันการจอง</h1>
      <p className="text-sm text-neutral-600">ใส่ลิงก์สลิป (MVP) หรือระบุว่าจะจ่ายหน้างาน</p>
      <input value={slipUrl} onChange={e=>setSlipUrl(e.target.value)} placeholder="https://.../slip.jpg" className="w-full rounded-lg border px-3 py-2" />
      <div className="flex gap-2">
        <button onClick={submit} disabled={saving} className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50">{saving? 'กำลังบันทึก...' : 'ยืนยัน'}</button>
        <button onClick={()=>router.push('/')} className="px-4 py-2 rounded-lg bg-neutral-200">ยกเลิก</button>
      </div>
    </main>
  )
}
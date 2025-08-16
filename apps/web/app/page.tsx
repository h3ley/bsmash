import Link from 'next/link'
export default function Page() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">bsmash</h1>
      <p className="text-sm text-neutral-600">จองคอร์ท & จัดก๊วน — MVP</p>
      <div className="flex gap-3">
        <Link className="px-4 py-2 rounded-xl bg-black text-white" href="/venues/1">ดูสนามตัวอย่าง</Link>
        <Link className="px-4 py-2 rounded-xl bg-neutral-200" href="/events">รอบก๊วน</Link>
      </div>
    </main>
  )
}
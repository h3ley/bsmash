import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function VenuesPage() {
  const { data: venues } = await supabaseServer.from('venues').select('id,name,address')
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">สนามทั้งหมด</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {venues?.map(v => (
          <Link key={v.id} href={`/venues/${v.id}`} className="block rounded-xl border p-4 hover:bg-neutral-50">
            <div className="font-medium">{v.name}</div>
            <div className="text-sm text-neutral-600">{v.address}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
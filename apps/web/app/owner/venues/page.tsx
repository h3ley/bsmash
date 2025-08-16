import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function OwnerVenues() {
  const { data: venues } = await supabaseServer.from('venues').select('id,name,address')
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">สนามของฉัน</h1>
      <div className="space-y-2">
        {venues?.map(v => (
          <Link key={v.id} href={`/owner/venues/${v.id}/calendar`} className="block rounded-xl border p-4 hover:bg-neutral-50">
            <div className="font-medium">{v.name}</div>
            <div className="text-sm text-neutral-600">{v.address}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
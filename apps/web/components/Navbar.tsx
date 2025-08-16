import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SignOutButton from './SignOutButton'

const items = [
  { href: "/", label: "bsmash" },
  { href: "/venues", label: "สนาม" },
  { href: "/events", label: "ก๊วน" },
  { href: "/me/bookings", label: "ของฉัน" },
  { href: '/me/groups', label: 'ก๊วนของฉัน' }
];

export default async function Navbar() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('display_name, role').eq('user_id', user.id).single()
    : { data: null }

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center gap-4">
        {items.map(it => (
          <Link key={it.href} href={it.href}
            className="text-sm px-2 py-1 rounded hover:bg-neutral-100">
            {it.label}
          </Link>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm">
                👤 {profile?.display_name ?? user.email}
              </span>
              <span className="text-xs rounded-full bg-neutral-200 px-2 py-0.5">
                {profile?.role ?? 'PLAYER'}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="text-sm px-2 py-1 rounded hover:bg-neutral-100">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
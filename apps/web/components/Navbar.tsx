"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation'

const items = [
  { href: "/", label: "bsmash" },
  { href: "/venues", label: "สนาม" },
  { href: "/events", label: "ก๊วน" },
  { href: "/me/bookings", label: "ของฉัน" },
  { href: '/me/groups', label: 'ก๊วนของฉัน' }
];

export default function Navbar() {
  const p = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center gap-4">
        {items.map(it => (
          <Link key={it.href} href={it.href} className={`text-sm px-2 py-1 rounded ${p===it.href? 'bg-black text-white':'hover:bg-neutral-100'}`}>{it.label}</Link>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className={`text-sm px-2 py-1 rounded ${p==='/login'?'bg-black text-white':'hover:bg-neutral-100'}`}>เข้าสู่ระบบ</Link>
          <button onClick={logout} className="text-sm px-2 py-1 rounded hover:bg-neutral-100">ออกจากระบบ</button>
        </div>
      </div>
    </nav>
  )
}
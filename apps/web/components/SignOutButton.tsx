'use client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.refresh()
  }
  return (
    <button onClick={signOut} className="text-sm px-2 py-1 rounded hover:bg-neutral-100">
      ออกจากระบบ
    </button>
  )
}

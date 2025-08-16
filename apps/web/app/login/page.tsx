'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? '')}/auth/callback`

  const magic = async () => {
    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    })
    setSending(false)
    alert(error ? error.message : 'ส่งลิงก์เข้าสู่ระบบไปที่อีเมลแล้ว')
  }

  const google = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    })
  }

  return (
    <main className="max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
      <div className="space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={magic} disabled={sending}
                className="w-full rounded bg-black text-white py-2 disabled:opacity-50">
          ส่งลิงก์เข้าอีเมล
        </button>
        <div className="text-center text-sm text-neutral-500">หรือ</div>
        <button onClick={google} className="w-full rounded bg-neutral-800 text-white py-2">
          เข้าด้วย Google
        </button>
      </div>
    </main>
  )
}

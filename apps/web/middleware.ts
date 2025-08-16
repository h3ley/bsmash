import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession() // refresh session ผ่าน middleware
  return res
}

// กันไฟล์ static ไม่ต้องวิ่ง middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

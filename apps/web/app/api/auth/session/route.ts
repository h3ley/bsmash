import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const s = await supabase.auth.getSession()
  return NextResponse.json(s)
}

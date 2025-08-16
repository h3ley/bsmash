import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ ok:false, error:'missing id' }, { status: 400 })
  const { data } = await supabaseServer.from('event_regs').select('id,status,paid,slip_url,checkin_at').eq('event_id', id)
  return NextResponse.json({ ok:true, regs: data||[] })
}
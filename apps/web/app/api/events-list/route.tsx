import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
export async function GET() {
  const { data } = await supabaseServer.from('events').select('id,title,start_at,end_at,status').order('start_at', { ascending: false })
  return NextResponse.json({ ok:true, events: data||[] })
}
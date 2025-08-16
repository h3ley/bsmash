-- เปิด RLS
alter table public.bookings enable row level security;
alter table public.event_regs enable row level security;

-- ผู้ใช้เห็น/แก้ไข booking ของตนเองเท่านั้น
create policy if not exists "bookings.select.own" on public.bookings
for select using (user_id = auth.uid());

create policy if not exists "bookings.modify.own" on public.bookings
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ผู้ใช้เห็น/แก้ไขการลงทะเบียนก๊วนของตนเอง
create policy if not exists "event_regs.select.own" on public.event_regs
for select using (user_id = auth.uid());

create policy if not exists "event_regs.modify.own" on public.event_regs
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ผู้จัด (organizer) เห็นรายชื่อคนสมัครในอีเวนต์ที่ตนจัด
-- หมายเหตุ: สมมติ schema ตาราง events มีคอลัมน์ organizer_id (uuid)
create policy if not exists "event_regs.select.by_organizer" on public.event_regs
for select using (
  exists (
    select 1 from public.events e
    where e.id = event_regs.event_id
      and e.organizer_id = auth.uid()
  )
);

-- (เลือกได้) ให้อ่าน booking ที่อยู่ในอีเวนต์ที่ตัวเองจัด (ถ้าอยาก รวม use-case เฉพาะ)
-- create policy if not exists "bookings.select.by_organizer" on public.bookings
-- for select using (
--   exists (
--     select 1 from public.events e
--     join public.slots s on s.court_id = e.court_id and s.start_at = e.start_at and s.end_at = e.end_at
--     where s.id = bookings.slot_id and e.organizer_id = auth.uid()
--   )
-- );

-- หมายเหตุ: สิทธิ์ OWNER (เจ้าของสนาม) จะซับซ้อนขึ้นเพราะต้องโยงถึงสนาม/คอร์ท
-- ถ้ายังไม่มีโครง owner_id ใน tables (venues/courts) ข้ามในรอบนี้ได้ก่อน
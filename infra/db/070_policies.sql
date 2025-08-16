-- เปิด RLS
alter table bookings enable row level security;
alter table event_regs enable row level security;

-- Policy bookings: อ่านเฉพาะของตนเอง
create policy "bookings.select.own" on bookings
for select using (user_id = auth.uid());

-- เพิ่ม/แก้ไข/ลบ เฉพาะของตนเอง
create policy "bookings.modify.own" on bookings
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Policy event_regs
create policy "event_regs.select.own" on event_regs
for select using (user_id = auth.uid());

create policy "event_regs.modify.own" on event_regs
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- หมายเหตุ:
-- - API ที่ทำงานในบริบท Service Role (เช่น job หรือ route ที่ตั้งใจใช้ service key)
--   จะไม่ถูกจำกัดโดย RLS (ใช้ด้วยความระมัดระวัง)

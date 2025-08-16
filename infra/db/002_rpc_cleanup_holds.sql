create or replace function cleanup_holds() returns void language plpgsql security definer as $$
begin
  -- ยกเลิก booking ที่ PENDING แต่หมดเวลา แล้วคืน slot
  update slots s set status='OPEN'
  from bookings b
  where b.slot_id = s.id and b.status='PENDING' and b.hold_expires_at < now() and s.status='PENDING';

  update bookings set status='CANCELLED' where status='PENDING' and hold_expires_at < now();
end; $$;
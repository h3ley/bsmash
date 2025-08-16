-- ⚠ ใช้เฉพาะ DEV: ล้างข้อมูลและรีเซ็ตไอดีทั้งหมด
truncate table
  event_regs,
  events,
  bookings,
  slots,
  courts,
  venues
restart identity cascade;

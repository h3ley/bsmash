-- ============ VENUES ============
with v as (
  insert into venues (name, address, open_time, close_time, tz)
  values
    ('Bsmash Arena', 'Bangkok, Thailand', '10:00', '22:00', 'Asia/Bangkok'),
    ('Racket Hub', 'Nonthaburi, Thailand', '09:00', '23:00', 'Asia/Bangkok'),
    ('Smash House', 'Pathum Thani, Thailand', '10:00', '22:00', 'Asia/Bangkok')
  returning id
),
-- ============ COURTS (1..6 per venue) ============
cr as (
  insert into courts (venue_id, court_no)
  select v.id, g.n
  from v cross join generate_series(1,6) as g(n)
  returning id, venue_id
),
-- ============ DAYS (next 14 days) ============
days as (
  select generate_series(
    date_trunc('day', now())::date,
    (date_trunc('day', now())::date + interval '13 day')::date,
    interval '1 day'
  ) d
),
-- ============ HOURS (8 slots/day: 12-16 & 18-22) ============
hours as (
  select * from (values
    (time '12:00'),(time '13:00'),(time '14:00'),(time '15:00'),
    (time '18:00'),(time '19:00'),(time '20:00'),(time '21:00')
  ) t(t)
),
-- ============ SLOTS (ALL OPEN) ============
slots_ins as (
  insert into slots (court_id, start_at, end_at, status)
  select c.id,
         (d.d + h.t) at time zone 'Asia/Bangkok' as start_at,
         ((d.d + h.t) at time zone 'Asia/Bangkok') + interval '1 hour' as end_at,
         'OPEN'::slot_status
  from cr c
  cross join days d
  cross join hours h
  returning id, court_id, start_at, end_at
),
-- ============ CREATE 3 EVENTS (block slot) ============
ev_slots as (
  select s.id as slot_id, s.court_id, s.start_at, s.end_at, c.venue_id
  from slots_ins s
  join courts c on c.id = s.court_id
  where c.court_no = 1
  order by s.start_at
  limit 3
),
ev_block as (
  update slots set status='BLOCKED', block_reason='EVENT'
  where id in (select slot_id from ev_slots)
  returning id
),
ev_created as (
  insert into events (organizer_id, venue_id, court_id, title, start_at, end_at, capacity, price_per_person, status)
  select null, c.venue_id, e.court_id,
         'Social Play #' || row_number() over (),
         e.start_at, e.end_at,
         8, 120, 'OPEN'::event_status
  from ev_slots e
  join courts c on c.id = e.court_id
  returning id
),
-- ============ BOOKINGS (mix: confirmed, pending, expired) ============
-- 2.1 Confirmed bookings (BOOKED)
confirmed_slots as (
  select id from slots_ins s
  where s.id not in (select slot_id from ev_slots)
  order by random() limit 8
),
confirmed_upd as (
  update slots set status='BOOKED'
  where id in (select id from confirmed_slots)
  returning id
),
confirmed_bk as (
  insert into bookings (user_id, slot_id, status, payment_status, hold_expires_at, slip_url)
  select null, id, 'CONFIRMED'::booking_status, 'PAID'::payment_status, null, 'https://picsum.photos/seed/paid/300/200'
  from confirmed_upd
  returning id
),
-- 2.2 Pending (still within hold window)
pending_slots as (
  select id from slots_ins s
  where s.id not in (select slot_id from ev_slots)
    and s.id not in (select id from confirmed_upd)
  order by random() limit 6
),
pending_upd as (
  update slots set status='PENDING'
  where id in (select id from pending_slots)
  returning id
),
pending_bk as (
  insert into bookings (user_id, slot_id, status, payment_status, hold_expires_at)
  select null, id, 'PENDING'::booking_status, 'UNPAID'::payment_status, now() + interval '15 minute'
  from pending_upd
  returning id
),
-- 2.3 Expired holds (เพื่อทดสอบ cleanup)
expired_slots as (
  select id from slots_ins s
  where s.id not in (select slot_id from ev_slots)
    and s.id not in (select id from confirmed_upd)
    and s.id not in (select id from pending_upd)
  order by random() limit 4
),
expired_upd as (
  update slots set status='PENDING'
  where id in (select id from expired_slots)
  returning id
),
expired_bk as (
  insert into bookings (user_id, slot_id, status, payment_status, hold_expires_at)
  select null, id, 'PENDING'::booking_status, 'UNPAID'::payment_status, now() - interval '30 minute'
  from expired_upd
  returning id
),
-- ============ EVENT REGS (some paid/unpaid) ============
ev_ids as (
  select id from ev_created order by id
),
ev_regs as (
  insert into event_regs (event_id, user_id, status, paid, slip_url)
  select (select id from ev_ids limit 1), null, 'CONFIRMED'::reg_status, 'PAID'::payment_status, 'https://picsum.photos/seed/ev1/300/200'
  union all
  select (select id from ev_ids limit 1), null, 'CONFIRMED'::reg_status, 'UNPAID'::payment_status, null
  union all
  select (select id from ev_ids offset 1 limit 1), null, 'CONFIRMED'::reg_status, 'UNPAID'::payment_status, null
  union all
  select (select id from ev_ids offset 2 limit 1), null, 'CONFIRMED'::reg_status, 'PAID'::payment_status, 'https://picsum.photos/seed/ev3/300/200'
  returning id
)
select
  (select count(*) from (select distinct venue_id from cr) x) as venues,
  (select count(*) from cr) as courts,
  (select count(*) from slots_ins) as slots,
  (select count(*) from ev_created) as events,
  (select count(*) from confirmed_bk) + (select count(*) from pending_bk) + (select count(*) from expired_bk) as bookings,
  (select count(*) from ev_regs) as event_regs;

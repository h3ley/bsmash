-- START bsmash seed (id-safe)
with v as (
  insert into venues (name, address)
  values ('Bsmash Arena', 'Bangkok, Thailand')
  returning id
),
cr as (
  insert into courts (venue_id, court_no)
  select v.id, n
  from v cross join (values (1),(2),(3),(4)) as t(n)
  returning id
),
days as (
  select generate_series(
    date_trunc('day', now())::date,
    (date_trunc('day', now())::date + interval '6 day')::date,
    interval '1 day'
  ) d
),
slots_ins as (
  insert into slots (court_id, start_at, end_at, status)
  select c.id,
         (d.d + time '18:00') at time zone 'Asia/Bangkok',
         (d.d + time '19:00') at time zone 'Asia/Bangkok',
         'OPEN'::slot_status
  from cr c cross join days d
  union all
  select c.id,
         (d.d + time '19:00') at time zone 'Asia/Bangkok',
         (d.d + time '20:00') at time zone 'Asia/Bangkok',
         'OPEN'::slot_status
  from cr c cross join days d
  union all
  select c.id,
         (d.d + time '20:00') at time zone 'Asia/Bangkok',
         (d.d + time '21:00') at time zone 'Asia/Bangkok',
         'OPEN'::slot_status
  from cr c cross join days d
  union all
  select c.id,
         (d.d + time '21:00') at time zone 'Asia/Bangkok',
         (d.d + time '22:00') at time zone 'Asia/Bangkok',
         'OPEN'::slot_status
  from cr c cross join days d
  returning id
)
select (select count(*) from cr) as courts_created,
       (select count(*) from slots_ins) as slots_created;
-- END bsmash seed
-- Profiles (Supabase auth.users มีในตัว)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text check (role in ('PLAYER','ORGANIZER','VENUE_OWNER','ADMIN')) default 'PLAYER',
  created_at timestamptz default now()
);

-- Venues & Courts
create table venues (
  id bigserial primary key,
  owner_id uuid references auth.users(id),
  name text not null,
  address text,
  open_time time not null default '08:00',
  close_time time not null default '22:00',
  tz text default 'Asia/Bangkok',
  created_at timestamptz default now()
);

create table courts (
  id bigserial primary key,
  venue_id bigint references venues(id) on delete cascade,
  court_no int not null,
  is_active boolean default true
);

-- Slots
create type slot_status as enum ('OPEN','PENDING','BOOKED','BLOCKED');
create table slots (
  id bigserial primary key,
  court_id bigint references courts(id) on delete cascade,
  start_at timestamptz not null,
  end_at   timestamptz not null,
  status slot_status not null default 'OPEN',
  block_reason text,
  unique (court_id, start_at, end_at)
);

-- Bookings
create type booking_status as enum ('PENDING','CONFIRMED','CANCELLED');
create type payment_status as enum ('UNPAID','PAID','REFUNDING','REFUNDED');
create table bookings (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  slot_id bigint references slots(id) on delete cascade,
  status booking_status not null default 'PENDING',
  payment_status payment_status not null default 'UNPAID',
  hold_expires_at timestamptz,
  qr_code text,
  slip_url text,
  created_at timestamptz default now(),
  unique (user_id, slot_id)
);

-- Events (Groups)
create type event_status as enum ('OPEN','CANCELLED','FINISHED');
create table events (
  id bigserial primary key,
  organizer_id uuid references auth.users(id),
  venue_id bigint references venues(id),
  court_id bigint references courts(id),
  title text not null,
  start_at timestamptz not null,
  end_at   timestamptz not null,
  capacity int not null check (capacity > 0),
  price_per_person numeric(10,2) default 0,
  status event_status not null default 'OPEN',
  created_at timestamptz default now()
);
create index on events (venue_id, start_at);

create type reg_status as enum ('CONFIRMED','CANCELLED');
create table event_regs (
  id bigserial primary key,
  event_id bigint references events(id) on delete cascade,
  user_id uuid references auth.users(id),
  status reg_status not null default 'CONFIRMED',
  paid payment_status not null default 'UNPAID',
  checkin_at timestamptz,
  slip_url text,
  unique (event_id, user_id)
);
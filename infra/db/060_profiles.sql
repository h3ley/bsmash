-- ตารางโปรไฟล์ (อ้างถึง auth.users)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'PLAYER', -- PLAYER | ORGANIZER | OWNER | ADMIN
  created_at timestamptz not null default now()
);

-- ฟังก์ชัน+ทริกเกอร์สร้างโปรไฟล์อัตโนมัติ
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Member'))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

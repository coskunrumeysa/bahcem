-- Bahçem için tek tablo. Supabase > SQL Editor'a yapıştırıp "Run" de.

create table if not exists public.bahcem_docs (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  key        text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Satır güvenliği: herkes yalnızca kendi kayıtlarını görebilir ve değiştirebilir.
alter table public.bahcem_docs enable row level security;

drop policy if exists "Kendi kayitlarim" on public.bahcem_docs;
create policy "Kendi kayitlarim" on public.bahcem_docs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Her güncellemede zaman damgasını yenile (cihazlar arası senkron buna bakıyor).
create or replace function public.bahcem_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end $$;

drop trigger if exists bahcem_touch on public.bahcem_docs;
create trigger bahcem_touch before insert or update on public.bahcem_docs
  for each row execute function public.bahcem_touch();

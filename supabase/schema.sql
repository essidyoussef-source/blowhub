-- ─────────────────────────────────────────────────────────────────────────
-- Blow Hub — schéma Supabase (synchronisation cloud optionnelle)
-- À exécuter dans l'éditeur SQL de ton projet Supabase.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists blowhub_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table blowhub_state enable row level security;

-- Chaque utilisateur ne voit et ne modifie que sa propre ligne.
drop policy if exists "own state" on blowhub_state;
create policy "own state" on blowhub_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

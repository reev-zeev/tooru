-- Purpose: provide database-level lifecycle transitions for jobs and dispatch offers.
create or replace function transition_job(p_job_id uuid, p_expected_status text, p_new_status text)
returns boolean
language plpgsql
as $$
begin
  update jobs
     set status = p_new_status,
         version = version + 1,
         updated_at = now()
   where id = p_job_id
     and status = p_expected_status;
  return found;
end;
$$;

create or replace function expire_dispatch_offers()
returns integer
language plpgsql
as $$
declare affected integer;
begin
  update dispatch_offers
     set status = 'expired'
   where status = 'offered'
     and expires_at <= now();
  get diagnostics affected = row_count;
  return affected;
end;
$$;

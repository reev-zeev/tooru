-- Purpose: seed the first Saudi commercial launch geography without hard-coding it into domain logic.

insert into countries (code, name, currency_code, timezone)
values ('SA', 'Saudi Arabia', 'SAR', 'Asia/Riyadh')
on conflict (code) do update set name = excluded.name, currency_code = excluded.currency_code, timezone = excluded.timezone;

insert into cities (country_id, code, name, timezone)
select id, v.code, v.name, 'Asia/Riyadh'
from countries c
cross join (values
  ('RUH','Riyadh'),
  ('JED','Jeddah'),
  ('MKH','Makkah'),
  ('TIF','Taif'),
  ('MED','Madinah'),
  ('DMM','Dammam')
) as v(code,name)
where c.code = 'SA'
on conflict (country_id, code) do update set name = excluded.name, timezone = excluded.timezone, active = true;

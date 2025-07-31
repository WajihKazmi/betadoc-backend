-- Betadoc Database Schema
-- Run this in your Supabase SQL editor

-- 1. patients
create table patients (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  language text,
  created_at timestamp default now(),
  last_seen timestamp,
  referral_source text,
  whatsapp_opt_in boolean default true
);

-- 2. doctors
create table doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone_number text not null unique,
  location text,
  specialty text,
  experience_years integer,
  languages_spoken text[],
  availability jsonb,
  bio text,
  focus text,
  is_active boolean default true,
  created_at timestamp default now(),
  -- Additional fields for doctor registration form
  email text,
  gender text,
  mdcn_license_number text,
  mdcn_certificate_url text,
  consultation_mode text default 'Both'
);

-- 3. consultation_types
create table consultation_types (
  id uuid primary key default gen_random_uuid(),
  name text, -- e.g., GC, THC, Specialist Follow-Up
  fee integer,
  doctor_earning integer,
  platform_fee integer,
  is_specialist boolean default false,
  is_follow_up boolean default false
);

-- 4. consultations
create table consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  doctor_id uuid references doctors(id),
  consultation_type uuid references consultation_types(id),
  status text, -- waiting, active, completed, cancelled
  created_at timestamp default now(),
  completed_at timestamp,
  language text,
  symptoms text,
  assigned_by text -- 'auto' or admin ID
);

-- 5. payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  consultation_id uuid references consultations(id),
  amount_paid integer,
  method text, -- paystack, flutterwave, bank_transfer
  is_verified boolean default false,
  verified_by text,
  paid_at timestamp,
  screenshot_url text
);

-- 6. referrals
create table referrals (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid references consultations(id),
  doctor_id uuid references doctors(id),
  patient_id uuid references patients(id),
  referral_note text,
  destination text,
  category text, -- test, scan, specialist
  file_url text,
  created_at timestamp default now()
);

-- 7. doctor_wallets
create table doctor_wallets (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id),
  total_earned integer default 0,
  pending_payout integer default 0,
  paid_out integer default 0,
  last_paid_date timestamp
);

-- 8. messages_log
create table messages_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  role text, -- doctor or patient
  message_text text,
  timestamp timestamp default now(),
  type text -- normal, fallback, media
);

-- 9. escalations
create table escalations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  trigger_count integer default 0,
  reason text,
  resolved boolean default false,
  escalated_at timestamp default now()
);

-- 10. unrecognized_messages
create table unrecognized_messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  message text,
  timestamp timestamp default now(),
  fallback_count integer default 1,
  escalated boolean default false
);

-- 11. prescriptions
create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid references consultations(id),
  patient_id uuid references patients(id),
  doctor_id uuid references doctors(id),
  diagnosis text,
  medications text, -- formatted string or JSON
  notes text,
  file_url text,
  created_at timestamp default now()
);

-- 12. feedback
create table feedback (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  consultation_id uuid references consultations(id),
  rating integer check (rating >= 1 and rating <= 5),
  timestamp timestamptz default now()
);

-- 13. shared_links (optional tracking)
create table shared_links (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  shared_message text,
  timestamp timestamptz default now()
);

-- Create indexes for better performance
create index idx_patients_phone on patients(phone_number);
create index idx_doctors_phone on doctors(phone_number);
create index idx_doctors_active on doctors(is_active);
create index idx_consultations_patient on consultations(patient_id);
create index idx_consultations_doctor on consultations(doctor_id);
create index idx_consultations_status on consultations(status);
create index idx_payments_consultation on payments(consultation_id);
create index idx_messages_user on messages_log(user_id);
create index idx_messages_timestamp on messages_log(timestamp);

-- Insert sample consultation types
insert into consultation_types (name, fee, doctor_earning, platform_fee, is_specialist, is_follow_up) values
('General Consultation', 5000, 4000, 1000, false, false),
('Specialist Consultation', 10000, 8000, 2000, true, false),
('Follow-up Consultation', 3000, 2400, 600, false, true),
('Emergency Consultation', 15000, 12000, 3000, false, false);

-- Enable Row Level Security (RLS) for better security
alter table patients enable row level security;
alter table doctors enable row level security;
alter table consultations enable row level security;
alter table payments enable row level security;
alter table referrals enable row level security;
alter table doctor_wallets enable row level security;
alter table messages_log enable row level security;
alter table escalations enable row level security;
alter table unrecognized_messages enable row level security;
alter table prescriptions enable row level security;
alter table feedback enable row level security;
alter table shared_links enable row level security; 
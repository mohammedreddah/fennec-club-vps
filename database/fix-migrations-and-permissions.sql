-- Safe to run even if some of this already exists.

-- 1. Create session_types + related columns/tables, if missing
CREATE TABLE IF NOT EXISTS session_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE attendance_sessions
  ADD COLUMN IF NOT EXISTS session_type_id uuid REFERENCES session_types(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS attendance_session_coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, coach_id)
);

-- 2. Fix permissions: grant your app's role full access to every table that
--    exists right now, regardless of which role created it
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fennec_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fennec_user;

-- 3. Prevent this from happening again: any table created LATER by the role
--    running this script will automatically grant fennec_user access too
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fennec_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fennec_user;

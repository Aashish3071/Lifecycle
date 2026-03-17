-- Migration 0002: Schedule the Metrics Engine via pg_cron
-- 
-- IMPORTANT: pg_cron must be enabled on your Supabase project.
-- Go to Supabase Dashboard → Database → Extensions → search "pg_cron" → Enable.
--
-- After enabling the extension, run this migration in the SQL Editor.

-- Enable the extension (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role (required on Supabase)
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the metrics engine to run every 6 hours
-- This recomputes all customer_metrics rows from raw events
SELECT cron.schedule(
  'run-metrics-engine',        -- unique job name
  '0 */6 * * *',               -- every 6 hours (at minute 0)
  $$SELECT run_metrics_engine()$$
);

-- Optional: If you want a daily-only schedule instead, use:
-- SELECT cron.schedule('run-metrics-engine', '0 2 * * *', $$SELECT run_metrics_engine()$$);
-- This runs at 2 AM UTC daily.

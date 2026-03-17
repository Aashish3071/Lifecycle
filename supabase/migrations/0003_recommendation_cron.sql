-- Migration 0003: Schedule Claude Recommendation Engine via pg_cron
-- 
-- This runs the recommendation engine edge function daily.
-- The Edge Function must be deployed first:
--   supabase functions deploy generate-recommendations
-- 
-- Alternatively, you can call it via pg_net (Supabase HTTP extension).
-- This migration sets up a daily call to the edge function.

CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule: Run recommendations generation once per day at 3 AM UTC
-- (runs 1 hour after the metrics engine so metrics are fresh)
SELECT cron.schedule(
  'run-recommendation-engine',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/generate-recommendations',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

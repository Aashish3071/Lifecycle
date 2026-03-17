-- Migration 0004: Helper RPC for Data Collector
-- Increments the events_today counter on the integrations table

CREATE OR REPLACE FUNCTION increment_integration_events(p_user_id uuid, p_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE integrations 
  SET events_today = events_today + 1,
      last_sync_at = now()
  WHERE user_id = p_user_id 
    AND type = p_type;
END;
$$;

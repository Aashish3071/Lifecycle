-- Core
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- The SMB tenant
  email text,
  name text,
  phone text,
  first_seen_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  source text NOT NULL, -- 'website', 'email', 'whatsapp', 'ga4'
  event_type text NOT NULL, -- 'page_view', 'add_to_cart', 'purchase', 'email_open', 'email_click', 'wa_read', 'wa_reply', 'cart_abandon', 'product_view'
  properties jsonb DEFAULT '{}'::jsonb,
  occurred_at timestamptz DEFAULT now()
);

-- Computed metrics
CREATE TABLE customer_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  user_id uuid NOT NULL,
  
  -- RFM
  days_since_last_purchase int,
  days_since_last_visit int,
  purchase_count_30d int DEFAULT 0,
  purchase_count_90d int DEFAULT 0,
  total_lifetime_value numeric DEFAULT 0,
  avg_order_value numeric DEFAULT 0,
  
  -- Engagement
  email_open_rate numeric DEFAULT 0,
  email_click_rate numeric DEFAULT 0,
  whatsapp_read_rate numeric DEFAULT 0,
  whatsapp_reply_rate numeric DEFAULT 0,
  website_sessions_30d int DEFAULT 0,
  
  -- Behavioral
  cart_abandonment_count_30d int DEFAULT 0,
  last_cart_value numeric DEFAULT 0,
  top_product_category text,
  preferred_channel text, -- 'email', 'whatsapp', 'website'
  best_contact_hour int, -- 0-23
  
  -- Lifecycle
  lifecycle_stage text DEFAULT 'new', -- 'new', 'active', 'champion', 'at_risk', 'dormant'
  engagement_score int DEFAULT 0, -- 0-100
  churn_risk_score int DEFAULT 0, -- 0-100
  
  computed_at timestamptz DEFAULT now()
);

CREATE TABLE business_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  metric_key text NOT NULL,
  metric_value numeric NOT NULL,
  period text NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start date NOT NULL,
  computed_at timestamptz DEFAULT now()
);

-- AI Layer
CREATE TABLE recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  explanation text NOT NULL,
  target_segment text NOT NULL,
  suggested_channel text,
  suggested_action text,
  expected_impact text,
  priority int DEFAULT 0,
  status text DEFAULT 'pending', -- 'pending', 'applied', 'dismissed'
  created_at timestamptz DEFAULT now()
);

-- Automation Layer
CREATE TABLE automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  n8n_workflow_id text,
  name text NOT NULL,
  status text DEFAULT 'draft', -- 'draft', 'active', 'paused'
  trigger_type text NOT NULL,
  total_runs int DEFAULT 0,
  last_run_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE campaign_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  automation_id uuid REFERENCES automations(id) ON DELETE SET NULL,
  channel text NOT NULL, -- 'email', 'whatsapp'
  subject text,
  sent_count int DEFAULT 0,
  delivered int DEFAULT 0,
  opened int DEFAULT 0,
  clicked int DEFAULT 0,
  revenue numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Infrastructure
CREATE TABLE integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- 'shopify', 'ga4', 'klaviyo', 'whatsapp'
  status text DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'syncing'
  config jsonb DEFAULT '{}'::jsonb,
  last_sync_at timestamptz,
  events_today int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
  status text NOT NULL,
  event_count int DEFAULT 0,
  error_message text,
  synced_at timestamptz DEFAULT now()
);

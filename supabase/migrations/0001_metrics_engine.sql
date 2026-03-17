-- Migration 0001: Metrics Engine RPC

CREATE OR REPLACE FUNCTION compute_customer_metrics_for_user(target_customer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    -- RFM
    v_days_since_last_purchase int;
    v_days_since_last_visit int;
    v_purchase_count_30d int;
    v_purchase_count_90d int;
    v_total_lifetime_value numeric;
    v_avg_order_value numeric;
    
    -- Engagement
    v_email_sent int;
    v_email_opens int;
    v_email_clicks int;
    
    v_wa_sent int;
    v_wa_reads int;
    v_wa_replies int;
    
    v_website_sessions_30d int;
    
    -- Behavioral
    v_cart_abandonment_count_30d int;
    
    -- Scoring
    v_engagement_score int := 0;
    v_lifecycle_stage text := 'new';
    v_churn_risk_score int := 0;
BEGIN
    SELECT user_id INTO v_user_id FROM customers WHERE id = target_customer_id;
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;

    -- Compute days since last purchase
    SELECT EXTRACT(DAY FROM (now() - max(occurred_at)))::int 
    INTO v_days_since_last_purchase
    FROM events WHERE customer_id = target_customer_id AND event_type = 'purchase';

    -- Compute days since last visit
    SELECT EXTRACT(DAY FROM (now() - max(occurred_at)))::int 
    INTO v_days_since_last_visit
    FROM events WHERE customer_id = target_customer_id AND source = 'website';

    -- Purchase counts
    SELECT count(*) 
    INTO v_purchase_count_30d
    FROM events WHERE customer_id = target_customer_id AND event_type = 'purchase' AND occurred_at >= now() - interval '30 days';

    SELECT count(*) 
    INTO v_purchase_count_90d
    FROM events WHERE customer_id = target_customer_id AND event_type = 'purchase' AND occurred_at >= now() - interval '90 days';

    -- LTV and AOV
    SELECT COALESCE(sum((properties->>'amount')::numeric), 0),
           COALESCE(avg((properties->>'amount')::numeric), 0)
    INTO v_total_lifetime_value, v_avg_order_value
    FROM events WHERE customer_id = target_customer_id AND event_type = 'purchase';

    -- Email open/click counts
    SELECT count(*) INTO v_email_opens FROM events WHERE customer_id = target_customer_id AND event_type = 'email_open';
    SELECT count(*) INTO v_email_clicks FROM events WHERE customer_id = target_customer_id AND event_type = 'email_click';

    -- WhatsApp reads/replies
    SELECT count(*) INTO v_wa_reads FROM events WHERE customer_id = target_customer_id AND event_type = 'wa_read';
    SELECT count(*) INTO v_wa_replies FROM events WHERE customer_id = target_customer_id AND event_type = 'wa_reply';
    
    -- Sessions
    SELECT count(*) INTO v_website_sessions_30d FROM events WHERE customer_id = target_customer_id AND source = 'website' AND occurred_at >= now() - interval '30 days';

    -- Cart abandons
    SELECT count(*) INTO v_cart_abandonment_count_30d FROM events WHERE customer_id = target_customer_id AND event_type = 'cart_abandon' AND occurred_at >= now() - interval '30 days';

    -- Calculate engagement score (0-100)
    v_engagement_score := LEAST(100, (
        (COALESCE(v_website_sessions_30d, 0) * 10) +
        (COALESCE(v_email_opens, 0) * 2) + 
        (COALESCE(v_email_clicks, 0) * 5) + 
        (COALESCE(v_wa_reads, 0) * 3) + 
        (COALESCE(v_wa_replies, 0) * 8) +
        (COALESCE(v_purchase_count_30d, 0) * 25)
    ));

    -- Lifecycle Stage Logic
    IF v_purchase_count_90d >= 3 AND v_engagement_score > 50 THEN
        v_lifecycle_stage := 'champion';
    ELSIF v_purchase_count_30d > 0 OR v_engagement_score > 30 THEN
        v_lifecycle_stage := 'active';
    ELSIF v_days_since_last_purchase > 30 AND v_days_since_last_purchase <= 60 THEN
        v_lifecycle_stage := 'at_risk';
    ELSIF v_days_since_last_visit IS NULL OR v_days_since_last_visit > 60 THEN
        v_lifecycle_stage := 'dormant';
    ELSE
        v_lifecycle_stage := 'new';
    END IF;

    -- Churn risk score (0-100)
    IF v_lifecycle_stage = 'dormant' THEN
        v_churn_risk_score := 95;
    ELSIF v_lifecycle_stage = 'at_risk' THEN
        v_churn_risk_score := 75 + LEAST(20, (COALESCE(v_days_since_last_visit, 90) / 3));
    ELSE
        v_churn_risk_score := GREATEST(0, 50 - (v_engagement_score / 2));
    END IF;

    -- Upsert into customer_metrics
    INSERT INTO customer_metrics (
        customer_id, user_id, 
        days_since_last_purchase, days_since_last_visit,
        purchase_count_30d, purchase_count_90d,
        total_lifetime_value, avg_order_value,
        website_sessions_30d, cart_abandonment_count_30d,
        engagement_score, lifecycle_stage, churn_risk_score,
        computed_at
    ) VALUES (
        target_customer_id, v_user_id,
        v_days_since_last_purchase, v_days_since_last_visit,
        v_purchase_count_30d, v_purchase_count_90d,
        v_total_lifetime_value, v_avg_order_value,
        v_website_sessions_30d, v_cart_abandonment_count_30d,
        v_engagement_score, v_lifecycle_stage, v_churn_risk_score,
        now()
    )
    ON CONFLICT (customer_id) DO UPDATE SET
        days_since_last_purchase = EXCLUDED.days_since_last_purchase,
        days_since_last_visit = EXCLUDED.days_since_last_visit,
        purchase_count_30d = EXCLUDED.purchase_count_30d,
        purchase_count_90d = EXCLUDED.purchase_count_90d,
        total_lifetime_value = EXCLUDED.total_lifetime_value,
        avg_order_value = EXCLUDED.avg_order_value,
        website_sessions_30d = EXCLUDED.website_sessions_30d,
        cart_abandonment_count_30d = EXCLUDED.cart_abandonment_count_30d,
        engagement_score = EXCLUDED.engagement_score,
        lifecycle_stage = EXCLUDED.lifecycle_stage,
        churn_risk_score = EXCLUDED.churn_risk_score,
        computed_at = EXCLUDED.computed_at;

END;
$$;


CREATE OR REPLACE FUNCTION run_metrics_engine()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM customers LOOP
        PERFORM compute_customer_metrics_for_user(r.id);
    END LOOP;
END;
$$;

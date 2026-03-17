import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

async function seed() {
  console.log('Seeding Supabase...');

  // 1. Integrations
  const integrations = [
    { user_id: MOCK_USER_ID, type: 'website', status: 'connected', events_today: 432, last_sync_at: new Date().toISOString() },
    { user_id: MOCK_USER_ID, type: 'ga4', status: 'disconnected', events_today: 0, last_sync_at: null },
    { user_id: MOCK_USER_ID, type: 'email', status: 'connected', events_today: 1205, last_sync_at: new Date().toISOString() },
    { user_id: MOCK_USER_ID, type: 'whatsapp', status: 'connected', events_today: 89, last_sync_at: new Date().toISOString() }
  ];

  for (const int of integrations) {
    const { error: intErr } = await supabase.from('integrations').upsert(int, { onConflict: 'user_id, type' }).select();
    if (intErr && intErr.code !== '23505') console.log('Int error:', intErr); // Ignore unique constraint if we didn't add it in schema perfectly
    else if (intErr) {
       // Manual check if exists
       const {data: ex} = await supabase.from('integrations').select('id').eq('user_id', MOCK_USER_ID).eq('type', int.type).single();
       if(!ex) {
           await supabase.from('integrations').insert(int);
       } else {
           await supabase.from('integrations').update(int).eq('id', ex.id);
       }
    }
  }
  console.log('Integrations seeded.');

  // 2. Business Metrics (Tier 3)
  const today = new Date();
  
  // Create 7 days of historical trend data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString();

    const dailyMetrics = [
      { user_id: MOCK_USER_ID, metric_key: 'total_customers', metric_value: 12000 + (i * 100), period: 'daily', period_start: dateStr, computed_at: dateStr },
      { user_id: MOCK_USER_ID, metric_key: 'active_customers', metric_value: 4100 + (Math.random() * 200), period: 'daily', period_start: dateStr, computed_at: dateStr },
      { user_id: MOCK_USER_ID, metric_key: 'at_risk_customers', metric_value: 2400 + (Math.random() * 50), period: 'daily', period_start: dateStr, computed_at: dateStr },
      { user_id: MOCK_USER_ID, metric_key: 'avg_engagement_rate', metric_value: 40 + (Math.random() * 5), period: 'daily', period_start: dateStr, computed_at: dateStr },
      { user_id: MOCK_USER_ID, metric_key: 'active_automations', metric_value: 4, period: 'daily', period_start: dateStr, computed_at: dateStr }
    ];

    for (const m of dailyMetrics) {
       await supabase.from('business_metrics').insert(m);
    }
  }

  console.log('Business Metrics seeded.');
  console.log('Seed complete!');
}

seed().catch(console.error);

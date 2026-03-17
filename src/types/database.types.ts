export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          user_id: string
          email: string | null
          name: string | null
          phone: string | null
          first_seen_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          email?: string | null
          name?: string | null
          phone?: string | null
          first_seen_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          first_seen_at?: string
          metadata?: Json
        }
      }
      events: {
        Row: {
          id: string
          customer_id: string | null
          user_id: string
          source: string
          event_type: string
          properties: Json
          occurred_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          user_id: string
          source: string
          event_type: string
          properties?: Json
          occurred_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          user_id?: string
          source?: string
          event_type?: string
          properties?: Json
          occurred_at?: string
        }
      }
      customer_metrics: {
        Row: {
          id: string
          customer_id: string | null
          user_id: string
          days_since_last_purchase: number | null
          days_since_last_visit: number | null
          purchase_count_30d: number
          purchase_count_90d: number
          total_lifetime_value: number
          avg_order_value: number
          email_open_rate: number
          email_click_rate: number
          whatsapp_read_rate: number
          whatsapp_reply_rate: number
          website_sessions_30d: number
          cart_abandonment_count_30d: number
          last_cart_value: number
          top_product_category: string | null
          preferred_channel: string | null
          best_contact_hour: number | null
          lifecycle_stage: string
          engagement_score: number
          churn_risk_score: number
          computed_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          user_id: string
          days_since_last_purchase?: number | null
          days_since_last_visit?: number | null
          purchase_count_30d?: number
          purchase_count_90d?: number
          total_lifetime_value?: number
          avg_order_value?: number
          email_open_rate?: number
          email_click_rate?: number
          whatsapp_read_rate?: number
          whatsapp_reply_rate?: number
          website_sessions_30d?: number
          cart_abandonment_count_30d?: number
          last_cart_value?: number
          top_product_category?: string | null
          preferred_channel?: string | null
          best_contact_hour?: number | null
          lifecycle_stage?: string
          engagement_score?: number
          churn_risk_score?: number
          computed_at?: string
        }
        Update: {
          // ... all the fields as optional
          id?: string
          // (truncated for brevity but in practice would include all)
          [key: string]: any
        }
      }
      business_metrics: {
        Row: {
          id: string
          user_id: string
          metric_key: string
          metric_value: number
          period: string
          period_start: string
          computed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_key: string
          metric_value: number
          period: string
          period_start: string
          computed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_key?: string
          metric_value?: number
          period?: string
          period_start?: string
          computed_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          title: string
          explanation: string
          target_segment: string
          suggested_channel: string | null
          suggested_action: string | null
          expected_impact: string | null
          priority: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          explanation: string
          target_segment: string
          suggested_channel?: string | null
          suggested_action?: string | null
          expected_impact?: string | null
          priority?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          explanation?: string
          target_segment?: string
          suggested_channel?: string | null
          suggested_action?: string | null
          expected_impact?: string | null
          priority?: number
          status?: string
          created_at?: string
        }
      }
      automations: {
        Row: {
          id: string
          user_id: string
          n8n_workflow_id: string | null
          name: string
          status: string
          trigger_type: string
          total_runs: number
          last_run_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          n8n_workflow_id?: string | null
          name: string
          status?: string
          trigger_type: string
          total_runs?: number
          last_run_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          n8n_workflow_id?: string | null
          name?: string
          status?: string
          trigger_type?: string
          total_runs?: number
          last_run_at?: string | null
          created_at?: string
        }
      }
      campaign_sends: {
        Row: {
          id: string
          user_id: string
          automation_id: string | null
          channel: string
          subject: string | null
          sent_count: number
          delivered: number
          opened: number
          clicked: number
          revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          automation_id?: string | null
          channel: string
          subject?: string | null
          sent_count?: number
          delivered?: number
          opened?: number
          clicked?: number
          revenue?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          automation_id?: string | null
          channel?: string
          subject?: string | null
          sent_count?: number
          delivered?: number
          opened?: number
          clicked?: number
          revenue?: number
          created_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          type: string
          status: string
          config: Json
          last_sync_at: string | null
          events_today: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          status?: string
          config?: Json
          last_sync_at?: string | null
          events_today?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          status?: string
          config?: Json
          last_sync_at?: string | null
          events_today?: number
          created_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          integration_id: string | null
          status: string
          event_count: number
          error_message: string | null
          synced_at: string
        }
        Insert: {
          id?: string
          integration_id?: string | null
          status: string
          event_count?: number
          error_message?: string | null
          synced_at?: string
        }
        Update: {
          id?: string
          integration_id?: string | null
          status?: string
          event_count?: number
          error_message?: string | null
          synced_at?: string
        }
      }
    }
  }
}

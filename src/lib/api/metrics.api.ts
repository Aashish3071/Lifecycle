import { supabase, MOCK_USER_ID } from '../supabase';
import type { Database } from '../../types/database.types';

type BusinessMetric = Database['public']['Tables']['business_metrics']['Row'];

export const metricsApi = {
  /**
   * Fetch the latest business metrics (e.g. for the Dashboard cards)
   */
  async getLatestMetrics() {
    const { data, error } = await supabase
      .from('business_metrics')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .order('computed_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
    
    // Process list into a keyed object for easier frontend consumption
    const metrics: Record<string, BusinessMetric> = {};
    data?.forEach(row => {
      // Keep only the most recent if there are duplicates from the limit
      if (!metrics[row.metric_key]) {
        metrics[row.metric_key] = row;
      }
    });

    return metrics;
  },

  /**
   * Fetch a specific metric's trend over time (e.g. for chart)
   */
  async getMetricTrend(metricKey: string, limitDays = 7): Promise<BusinessMetric[]> {
    const { data, error } = await supabase
      .from('business_metrics')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .eq('metric_key', metricKey)
      .order('computed_at', { ascending: false })
      .limit(limitDays);

    if (error) {
      console.error(`Error fetching trend for ${metricKey}:`, error);
      throw error;
    }

    return (data || []) as BusinessMetric[];
  }
};

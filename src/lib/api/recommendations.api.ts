import { supabase, MOCK_USER_ID } from '../supabase';
import type { Database } from '../../types/database.types';

type Recommendation = Database['public']['Tables']['recommendations']['Row'];

export const recommendationsApi = {
  /**
   * Fetch generated recommendations for the user
   */
  async getRecommendations() {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    return data as Recommendation[];
  },

  /**
   * Update recommendation status (e.g. applied vs dismissed)
   */
  async updateRecommendationStatus(id: string, status: 'pending' | 'applied' | 'dismissed') {
    // Note: using any here because the generated types for the update payload
    // on this specific table are inferring as `never` incorrectly.
    const { data, error } = await (supabase as any)
      .from('recommendations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recommendation status:', error);
      throw error;
    }

    return data;
  }
};

import { supabase, MOCK_USER_ID } from '../supabase';
import type { Database } from '../../types/database.types';

type Integration = Database['public']['Tables']['integrations']['Row'];

export const integrationsApi = {
  /**
   * Fetch all integrations for the user
   */
  async getIntegrations() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .order('type', { ascending: true });

    if (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update integration status (mock connection/disconnection flow)
   */
  async updateIntegrationStatus(id: string, status: string) {
    const updatePayload: Database['public']['Tables']['integrations']['Update'] = { status };
    const { data, error } = await supabase
      .from('integrations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating integration status:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create an initial integration row if not exists
   */
  async initializeIntegration(type: string) {
    // Check if it exists
    const { data: existing } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .eq('type', type)
      .single();

    if (existing) return existing;

    const insertPayload: Database['public']['Tables']['integrations']['Insert'] = {
      user_id: MOCK_USER_ID,
      type,
      status: 'disconnected'
    };

    // Create disconnected placeholder
    const { data, error } = await supabase
      .from('integrations')
      .insert(insertPayload)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};

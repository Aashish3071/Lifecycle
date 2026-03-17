import { supabase, MOCK_USER_ID } from '../supabase';
import type { Database } from '../../types/database.types';

type Automation = Database['public']['Tables']['automations']['Row'];
type AutomationInsert = Database['public']['Tables']['automations']['Insert'];
type AutomationUpdate = Database['public']['Tables']['automations']['Update'];

export const automationsApi = {
  /**
   * Fetch all automations for the user
   */
  async getAutomations() {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching automations:', error);
      throw error;
    }

    return data as Automation[];
  },

  /**
   * Fetch a single automation by ID
   */
  async getAutomation(id: string) {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)
      .single();

    if (error) {
      console.error(`Error fetching automation ${id}:`, error);
      throw error;
    }

    return data as Automation;
  },

  /**
   * Toggle automation status (active/paused/draft)
   */
  async updateStatus(id: string, status: 'active' | 'paused' | 'draft') {
    const { data, error } = await (supabase as any)
      .from('automations')
      .update({ status })
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)
      .select()
      .single();

    if (error) {
      console.error(`Error updating automation ${id}:`, error);
      throw error;
    }

    return data as Automation;
  },

  /**
   * Create or update an automation
   */
  async saveAutomation(automation: AutomationInsert | AutomationUpdate) {
    // Determine if it's an update (has ID) or insert
    const isUpdate = 'id' in automation && !!automation.id;

    if (isUpdate) {
        const { data, error } = await (supabase as any)
            .from('automations')
            .update(automation)
            .eq('id', automation.id)
            .eq('user_id', MOCK_USER_ID)
            .select()
            .single();

        if (error) throw error;
        return data as Automation;
    } else {
        const { data, error } = await (supabase as any)
            .from('automations')
            .insert({ ...automation, user_id: MOCK_USER_ID })
            .select()
            .single();

        if (error) throw error;
        return data as Automation;
    }
  }
};

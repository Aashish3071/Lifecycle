import { supabase, MOCK_USER_ID } from '../supabase';
import type { Database } from '../../types/database.types';

type CampaignSend = Database['public']['Tables']['campaign_sends']['Row'];

export const campaignsApi = {
  /**
   * Fetch all campaigns for a specific channel
   */
  async getCampaigns(channel: 'email' | 'whatsapp') {
    const { data, error } = await supabase
      .from('campaign_sends')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .eq('channel', channel)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${channel} campaigns:`, error);
      throw error;
    }

    return data as CampaignSend[];
  },

  /**
   * Fetch all campaigns across all channels
   */
  async getAllCampaigns() {
    const { data, error } = await supabase
      .from('campaign_sends')
      .select('*')
      .eq('user_id', MOCK_USER_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all campaigns:', error);
      throw error;
    }

    return data as CampaignSend[];
  },

  /**
   * Create a new campaign send
   */
  async createCampaign(campaign: {
    channel: 'email' | 'whatsapp';
    subject: string;
    sent_count: number;
    status?: string;
    campaign_group_id?: string;
  }) {
    const { data, error } = await (supabase as any)
      .from('campaign_sends')
      .insert({
        user_id: MOCK_USER_ID,
        channel: campaign.channel,
        subject: campaign.subject,
        sent_count: campaign.sent_count,
        delivered: campaign.sent_count,
        status: campaign.status || 'sent',
        campaign_group_id: campaign.campaign_group_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    return data;
  },
};

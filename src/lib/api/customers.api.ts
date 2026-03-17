import { supabase, MOCK_USER_ID } from '../supabase';

export const customersApi = {
  /**
   * Fetch customers based on a specific lifecycle stage
   */
  async getCustomersByStage(stage: string) {
    // We join customers and customer_metrics
    const { data, error } = await supabase
      .from('customer_metrics')
      .select(`
        *,
        customers (
          id,
          email,
          name,
          first_seen_at
        )
      `)
      .eq('user_id', MOCK_USER_ID)
      .eq('lifecycle_stage', stage)
      .order('churn_risk_score', { ascending: false });

    if (error) {
      console.error('Error fetching customers by stage:', error);
      throw error;
    }

    // Flatten the join so consumers get { ...metrics, name, email, id }
    return (data || []).map((row: any) => ({
      ...row,
      id: row.customers?.id || row.customer_id,
      name: row.customers?.name,
      email: row.customers?.email,
    }));
  },

  /**
   * Get distribution of customers across lifecycle stages
   */
  async getSegmentDistribution() {
    // Note: Supabase JS doesn't have a direct 'GROUP BY COUNT' elegant abstraction.
    // Usually handled via a database view or RPC.
    // For now we simulate by doing a lightweight fetch or we'll create an RPC later.
    const { data, error } = await supabase
      // As a fallback without RPC, just pull basic stats if volume is low, 
      // or call a dedicated RPC: .rpc('get_segment_distribution', { user_id: MOCK_USER_ID })
      .from('customer_metrics')
      .select('lifecycle_stage')
      .eq('user_id', MOCK_USER_ID);

    if (error) throw error;

    const counts: Record<string, number> = {
      new: 0,
      active: 0,
      champion: 0,
      at_risk: 0,
      dormant: 0
    };

    data?.forEach(row => {
      if (counts[row.lifecycle_stage] !== undefined) {
        counts[row.lifecycle_stage]++;
      }
    });

    return counts;
  },

  /**
   * Fetch full profile for a specific customer including metrics and recent events
   */
  async getCustomerProfile(id: string) {
    const { data: customerData, error: customerError } = await (supabase as any)
      .from('customers')
      .select(`
        *,
        customer_metrics (*)
      `)
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)
      .single();

    if (customerError) throw customerError;
    if (!customerData) throw new Error("Customer not found.");

    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('customer_id', id)
      .eq('user_id', MOCK_USER_ID)
      .order('created_at', { ascending: false })
      .limit(50);

    if (eventsError) throw eventsError;

    // Handle array wrapping from Supabase joins
    const metrics = customerData.customer_metrics 
      ? (Array.isArray(customerData.customer_metrics) ? customerData.customer_metrics[0] : customerData.customer_metrics) 
      : null;

    return { 
      customer: customerData, 
      metrics, 
      events: eventsData || [] 
    };
  }
};

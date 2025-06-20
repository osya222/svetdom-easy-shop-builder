import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FooterSettings {
  id: number;
  business_name?: string;
  inn?: string;
  ogrnip?: string;
  address_line_1?: string;
  address_line_2?: string;
  email?: string;
  phone?: string;
  payment_link?: string;
  delivery_link?: string;
  policy_link?: string;
  agreement_link?: string;
  admin_link?: string;
  payment_text?: string;
  delivery_text?: string;
  policy_text?: string;
  agreement_text?: string;
  admin_text?: string;
}

export const useFooterSettings = () => {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      console.log('Fetching footer settings...');
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching footer settings:', error);
        throw error;
      }

      console.log('Footer settings loaded:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<FooterSettings>) => {
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating footer settings:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
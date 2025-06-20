import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSettings {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  background_image_url: string;
  background_alt: string;
  created_at: string;
  updated_at: string;
}

export const useHeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки настроек Hero');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updateData: Partial<Omit<HeroSettings, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .update(updateData)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка обновления настроек Hero');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};
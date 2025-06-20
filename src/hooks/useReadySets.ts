import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReadySet {
  id: number;
  name: string;
  price: number;
  description: string;
  product_ids: number[];
  created_at: string;
  updated_at: string;
}

export const useReadySets = () => {
  const [readySets, setReadySets] = useState<ReadySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadySets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ready_sets')
        .select('*')
        .order('id');

      if (error) throw error;
      setReadySets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки готовых наборов');
    } finally {
      setLoading(false);
    }
  };

  const createReadySet = async (setData: Omit<ReadySet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ready_sets')
        .insert(setData)
        .select()
        .single();

      if (error) throw error;
      await fetchReadySets();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка создания набора');
    }
  };

  const updateReadySet = async (id: number, setData: Partial<Omit<ReadySet, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('ready_sets')
        .update(setData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchReadySets();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка обновления набора');
    }
  };

  const deleteReadySet = async (id: number) => {
    try {
      const { error } = await supabase
        .from('ready_sets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchReadySets();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка удаления набора');
    }
  };

  useEffect(() => {
    fetchReadySets();
  }, []);

  return {
    readySets,
    loading,
    error,
    createReadySet,
    updateReadySet,
    deleteReadySet,
    refetch: fetchReadySets
  };
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCategories();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка обновления категории');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    updateCategory,
    refetch: fetchCategories
  };
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      const formattedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        power: item.power,
        lightColor: item.light_color,
        price: item.price,
        image: item.image_url || '',
        category: item.category as Product['category'],
        compatibleWith: item.compatible_with || [],
        description: item.description
      }));

      setProducts(formattedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          power: productData.power,
          light_color: productData.lightColor,
          price: productData.price,
          image_url: productData.image,
          category: productData.category,
          compatible_with: productData.compatibleWith,
          description: productData.description
        })
        .select()
        .single();

      if (error) throw error;
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка создания товара');
    }
  };

  const updateProduct = async (id: number, productData: Partial<Omit<Product, 'id'>>) => {
    try {
      const updateData: any = {};
      if (productData.name) updateData.name = productData.name;
      if (productData.power) updateData.power = productData.power;
      if (productData.lightColor) updateData.light_color = productData.lightColor;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image !== undefined) updateData.image_url = productData.image;
      if (productData.category) updateData.category = productData.category;
      if (productData.compatibleWith !== undefined) updateData.compatible_with = productData.compatibleWith;
      if (productData.description !== undefined) updateData.description = productData.description;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка обновления товара');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка удаления товара');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
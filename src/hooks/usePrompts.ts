import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'] | null;
  user_likes?: { user_id: string }[];
  user_favorites?: { user_id: string }[];
};

type Category = Database['public']['Tables']['categories']['Row'];

interface UsePromptsOptions {
  categoryId?: string | null;
  searchQuery?: string;
  userId?: string;
  onlyFavorites?: boolean;
  limit?: number;
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  };

  const fetchPrompts = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('prompts')
        .select(`
          *,
          categories (*),
          user_likes (user_id),
          user_favorites (user_id)
        `)
        .order('created_at', { ascending: false });

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.userId) {
        query = query.eq('user_id', options.userId);
      } else {
        query = query.eq('is_public', true);
      }

      if (options.searchQuery) {
        query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (options.onlyFavorites && options.userId) {
        const favoritePrompts = (data as any)?.filter((prompt: any) =>
          prompt.user_favorites?.some((fav: any) => fav.user_id === options.userId)
        ) || [];
        setPrompts(favoritePrompts as Prompt[]);
      } else {
        setPrompts((data as Prompt[]) || []);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [options.categoryId, options.searchQuery, options.userId, options.onlyFavorites]);

  const refetch = () => {
    fetchPrompts();
  };

  return {
    prompts,
    categories,
    loading,
    error,
    refetch,
  };
}

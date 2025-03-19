import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Property } from '../types';

interface UsePropertiesOptions {
  limit?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
    searchTerm?: string;
    isFurnished?: boolean;
  };
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (options.limit) {
          query = query.limit(options.limit);
        }

        if (options.filters) {
          const { minPrice, maxPrice, bedrooms, bathrooms, location, searchTerm, isFurnished } = options.filters;

          if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
          }

          if (minPrice !== undefined) {
            query = query.gte('price', minPrice);
          }

          if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice);
          }

          if (bedrooms !== undefined) {
            query = query.eq('bedrooms', bedrooms);
          }

          if (bathrooms !== undefined) {
            query = query.eq('bathrooms', bathrooms);
          }

          if (location) {
            query = query.ilike('location', `%${location}%`);
          }

          if (isFurnished !== undefined) {
            query = query.eq('is_furnished', isFurnished);
          }
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw supabaseError;
        }

        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching properties'));
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [options]);

  return { properties, loading, error };
}
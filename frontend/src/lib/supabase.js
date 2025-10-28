import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Authentication features will be disabled.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper functions for authentication
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Helper functions for favorite cities
export const favoriteCities = {
  // Get all favorite cities for current user
  getAll: async () => {
    const { data, error } = await supabase
      .from('favorite_cities')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add a favorite city
  add: async (cityName, countryCode, latitude, longitude) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('favorite_cities')
      .insert([
        {
          user_id: user.id,
          city_name: cityName,
          country_code: countryCode,
          latitude,
          longitude,
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  // Remove a favorite city
  remove: async (id) => {
    const { error } = await supabase
      .from('favorite_cities')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Check if city is favorited
  isFavorite: async (cityName, countryCode) => {
    const { data, error } = await supabase
      .from('favorite_cities')
      .select('id')
      .eq('city_name', cityName)
      .eq('country_code', countryCode)
      .single();
    return { isFavorite: !!data, favoriteId: data?.id, error };
  },
};

// Helper functions for search history
export const searchHistory = {
  // Get search history for current user
  getAll: async (limit = 10) => {
    const { data, error } = await supabase
      .from('weather_search_history')
      .select('*')
      .order('searched_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Add search to history
  add: async (cityName, countryCode, temperature, weatherDescription) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('weather_search_history')
      .insert([
        {
          user_id: user?.id || null,
          city_name: cityName,
          country_code: countryCode,
          temperature,
          weather_description: weatherDescription,
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  // Clear all search history
  clearAll: async () => {
    const { error } = await supabase
      .from('weather_search_history')
      .delete()
      .not('id', 'is', null);
    return { error };
  },
};

// Helper functions for user preferences
export const userPreferences = {
  // Get user preferences
  get: async () => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .single();
    return { data, error };
  },

  // Update user preferences
  update: async (preferences) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', user.id)
      .select()
      .single();
    return { data, error };
  },
};


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async ({ email, password }) => {
    return await supabase.auth.signUp({ email, password });
  },

  signIn: async ({ email, password, rememberMe }) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        autoRefreshToken: true,
        persistSession: rememberMe,
      },
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

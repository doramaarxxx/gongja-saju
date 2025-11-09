import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saju_results: {
        Row: {
          id: string;
          user_id: string | null;
          gender: string;
          birth_year: number;
          birth_month: number;
          birth_day: number;
          birth_time: string;
          lunar_calendar: boolean;
          fortune_result: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          gender: string;
          birth_year: number;
          birth_month: number;
          birth_day: number;
          birth_time: string;
          lunar_calendar?: boolean;
          fortune_result: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          gender?: string;
          birth_year?: number;
          birth_month?: number;
          birth_day?: number;
          birth_time?: string;
          lunar_calendar?: boolean;
          fortune_result?: any;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
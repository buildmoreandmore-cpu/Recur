export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      professionals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          business_name: string | null;
          email: string;
          phone: string | null;
          location: string | null;
          years_in_business: number;
          specialties: string[];
          industry: string;
          annual_goal: number;
          monthly_goal: number;
          default_rotation: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          business_name?: string | null;
          email: string;
          phone?: string | null;
          location?: string | null;
          years_in_business?: number;
          specialties?: string[];
          industry?: string;
          annual_goal?: number;
          monthly_goal?: number;
          default_rotation?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          business_name?: string | null;
          email?: string;
          phone?: string | null;
          location?: string | null;
          years_in_business?: number;
          specialties?: string[];
          industry?: string;
          annual_goal?: number;
          monthly_goal?: number;
          default_rotation?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          professional_id: string;
          name: string;
          price: number;
          category: 'base' | 'addon' | 'event';
          created_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          name: string;
          price?: number;
          category?: 'base' | 'addon' | 'event';
          created_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          name?: string;
          price?: number;
          category?: 'base' | 'addon' | 'event';
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          professional_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          status: 'confirmed' | 'pending' | 'at-risk';
          rotation: 'PRIORITY' | 'STANDARD' | 'FLEX' | 'CUSTOM';
          rotation_weeks: number;
          annual_value: number;
          base_service_id: string | null;
          client_since: string;
          next_appointment: string | null;
          preferred_days: string[];
          preferred_time: string | null;
          contact_method: string;
          occupation: string | null;
          client_facing: boolean;
          morning_time: string | null;
          photographed: string | null;
          concerns: string | null;
          service_goal: string | null;
          maintenance_level: string | null;
          additional_notes: string | null;
          industry_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          status?: 'confirmed' | 'pending' | 'at-risk';
          rotation?: 'PRIORITY' | 'STANDARD' | 'FLEX' | 'CUSTOM';
          rotation_weeks?: number;
          annual_value?: number;
          base_service_id?: string | null;
          client_since?: string;
          next_appointment?: string | null;
          preferred_days?: string[];
          preferred_time?: string | null;
          contact_method?: string;
          occupation?: string | null;
          client_facing?: boolean;
          morning_time?: string | null;
          photographed?: string | null;
          concerns?: string | null;
          service_goal?: string | null;
          maintenance_level?: string | null;
          additional_notes?: string | null;
          industry_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          status?: 'confirmed' | 'pending' | 'at-risk';
          rotation?: 'PRIORITY' | 'STANDARD' | 'FLEX' | 'CUSTOM';
          rotation_weeks?: number;
          annual_value?: number;
          base_service_id?: string | null;
          client_since?: string;
          next_appointment?: string | null;
          preferred_days?: string[];
          preferred_time?: string | null;
          contact_method?: string;
          occupation?: string | null;
          client_facing?: boolean;
          morning_time?: string | null;
          photographed?: string | null;
          concerns?: string | null;
          service_goal?: string | null;
          maintenance_level?: string | null;
          additional_notes?: string | null;
          industry_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      client_addons: {
        Row: {
          id: string;
          client_id: string;
          service_id: string;
          frequency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          service_id: string;
          frequency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          service_id?: string;
          frequency?: string;
          created_at?: string;
        };
      };
      client_events: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          date: string;
          service_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          date: string;
          service_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          date?: string;
          service_id?: string | null;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          date: string;
          service_name: string | null;
          price: number;
          status: 'completed' | 'upcoming' | 'scheduled' | 'event' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          date: string;
          service_name?: string | null;
          price?: number;
          status?: 'completed' | 'upcoming' | 'scheduled' | 'event' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          date?: string;
          service_name?: string | null;
          price?: number;
          status?: 'completed' | 'upcoming' | 'scheduled' | 'event' | 'cancelled';
          created_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          professional_id: string;
          status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
          client_name: string;
          client_phone: string | null;
          client_email: string | null;
          referral_source: string | null;
          contact_method: string | null;
          preferred_days: string[];
          preferred_time: string | null;
          occupation: string | null;
          upcoming_events: string | null;
          morning_time: string | null;
          service_goal: string | null;
          maintenance_level: string | null;
          concerns: string | null;
          requested_service_id: string | null;
          requested_date: string | null;
          requested_time_slot: string | null;
          has_card_on_file: boolean;
          deposit_paid: boolean;
          card_last4: string | null;
          additional_notes: string | null;
          industry_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          status?: 'pending' | 'confirmed' | 'declined' | 'cancelled';
          client_name: string;
          client_phone?: string | null;
          client_email?: string | null;
          referral_source?: string | null;
          contact_method?: string | null;
          preferred_days?: string[];
          preferred_time?: string | null;
          occupation?: string | null;
          upcoming_events?: string | null;
          morning_time?: string | null;
          service_goal?: string | null;
          maintenance_level?: string | null;
          concerns?: string | null;
          requested_service_id?: string | null;
          requested_date?: string | null;
          requested_time_slot?: string | null;
          has_card_on_file?: boolean;
          deposit_paid?: boolean;
          card_last4?: string | null;
          additional_notes?: string | null;
          industry_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          status?: 'pending' | 'confirmed' | 'declined' | 'cancelled';
          client_name?: string;
          client_phone?: string | null;
          client_email?: string | null;
          referral_source?: string | null;
          contact_method?: string | null;
          preferred_days?: string[];
          preferred_time?: string | null;
          occupation?: string | null;
          upcoming_events?: string | null;
          morning_time?: string | null;
          service_goal?: string | null;
          maintenance_level?: string | null;
          concerns?: string | null;
          requested_service_id?: string | null;
          requested_date?: string | null;
          requested_time_slot?: string | null;
          has_card_on_file?: boolean;
          deposit_paid?: boolean;
          card_last4?: string | null;
          additional_notes?: string | null;
          industry_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_settings: {
        Row: {
          id: string;
          professional_id: string;
          profile_slug: string | null;
          bio: string | null;
          show_prices: boolean;
          taking_new_clients: boolean;
          waitlist_mode: boolean;
          require_deposit: boolean;
          deposit_amount: number;
          deposit_type: 'fixed' | 'percentage';
          minimum_lead_time: string;
          maximum_advance_booking: string;
          auto_confirm_existing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          profile_slug?: string | null;
          bio?: string | null;
          show_prices?: boolean;
          taking_new_clients?: boolean;
          waitlist_mode?: boolean;
          require_deposit?: boolean;
          deposit_amount?: number;
          deposit_type?: 'fixed' | 'percentage';
          minimum_lead_time?: string;
          maximum_advance_booking?: string;
          auto_confirm_existing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          profile_slug?: string | null;
          bio?: string | null;
          show_prices?: boolean;
          taking_new_clients?: boolean;
          waitlist_mode?: boolean;
          require_deposit?: boolean;
          deposit_amount?: number;
          deposit_type?: 'fixed' | 'percentage';
          minimum_lead_time?: string;
          maximum_advance_booking?: string;
          auto_confirm_existing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          professional_id: string;
          email_notifications: boolean;
          overdue_alerts: boolean;
          weekly_summary: boolean;
          payment_confirmations: boolean;
          currency: string;
          date_format: string;
          start_of_week: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          email_notifications?: boolean;
          overdue_alerts?: boolean;
          weekly_summary?: boolean;
          payment_confirmations?: boolean;
          currency?: string;
          date_format?: string;
          start_of_week?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          email_notifications?: boolean;
          overdue_alerts?: boolean;
          weekly_summary?: boolean;
          payment_confirmations?: boolean;
          currency?: string;
          date_format?: string;
          start_of_week?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist_entries: {
        Row: {
          id: string;
          professional_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          service_interested: string | null;
          notes: string | null;
          date_added: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          service_interested?: string | null;
          notes?: string | null;
          date_added?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          service_interested?: string | null;
          notes?: string | null;
          date_added?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

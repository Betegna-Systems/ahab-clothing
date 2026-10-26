export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string;
          customer_name: string;
          delivery: number;
          email: string | null;
          id: string;
          image_url: string | null;
          items: Json;
          notes: string | null;
          order_number: string;
          payment_method: string;
          payment_access_token_hash: string | null;
          payment_proof_path: string | null;
          payment_status: string;
          payment_submitted_at: string | null;
          phone: string;
          status: string;
          sub_city: string | null;
          subtotal: number;
          total: number;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          customer_name: string;
          delivery: number;
          email?: string | null;
          id?: string;
          image_url?: string | null;
          items: Json;
          notes?: string | null;
          order_number: string;
          payment_method: string;
          payment_access_token_hash?: string | null;
          payment_proof_path?: string | null;
          payment_status?: string;
          payment_submitted_at?: string | null;
          phone: string;
          status?: string;
          sub_city?: string | null;
          subtotal: number;
          total: number;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          customer_name?: string;
          delivery?: number;
          email?: string | null;
          id?: string;
          image_url?: string | null;
          items?: Json;
          notes?: string | null;
          order_number?: string;
          payment_method?: string;
          payment_access_token_hash?: string | null;
          payment_proof_path?: string | null;
          payment_status?: string;
          payment_submitted_at?: string | null;
          phone?: string;
          status?: string;
          sub_city?: string | null;
          subtotal?: number;
          total?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

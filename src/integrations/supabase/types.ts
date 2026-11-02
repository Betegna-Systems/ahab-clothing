export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admin_push_tokens: {
        Row: {
          created_at: string;
          platform: string;
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          platform: string;
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          platform?: string;
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      customer_reviews: {
        Row: {
          created_at: string;
          fit_feedback: string;
          id: string;
          order_number: string;
          photo_path: string | null;
          product_slug: string;
          rating: number;
          review_text: string;
          reviewer_name: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          fit_feedback: string;
          id?: string;
          order_number: string;
          photo_path?: string | null;
          product_slug: string;
          rating: number;
          review_text: string;
          reviewer_name: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          fit_feedback?: string;
          id?: string;
          order_number?: string;
          photo_path?: string | null;
          product_slug?: string;
          rating?: number;
          review_text?: string;
          reviewer_name?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_reviews_order_number_fkey";
            columns: ["order_number"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["order_number"];
          },
        ];
      };
      product_variant_inventory: {
        Row: {
          color: string;
          product_slug: string;
          quantity: number;
          size: string;
          updated_at: string;
        };
        Insert: {
          color: string;
          product_slug: string;
          quantity?: number;
          size: string;
          updated_at?: string;
        };
        Update: {
          color?: string;
          product_slug?: string;
          quantity?: number;
          size?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
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
          inventory_released_at: string | null;
          inventory_reserved_at: string | null;
          items: Json;
          notes: string | null;
          order_number: string;
          payment_access_token_hash: string | null;
          payment_method: string;
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
          inventory_released_at?: string | null;
          inventory_reserved_at?: string | null;
          items: Json;
          notes?: string | null;
          order_number: string;
          payment_access_token_hash?: string | null;
          payment_method: string;
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
          inventory_released_at?: string | null;
          inventory_reserved_at?: string | null;
          items?: Json;
          notes?: string | null;
          order_number?: string;
          payment_access_token_hash?: string | null;
          payment_method?: string;
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
    Views: {
      [_ in never]: never;
    };
    Functions: {
      place_order_with_inventory: {
        Args: { p_order: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

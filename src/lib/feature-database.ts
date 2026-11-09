import type { Database, Json } from "@/integrations/supabase/types";

// Contracts for the checked-in feature migrations, not evidence they are deployed.
type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};
type Commission = {
  id: string;
  commission_type: string;
  customer_name: string;
  phone: string;
  email: string;
  occasion: string;
  style: string;
  color: string;
  fabric: string;
  budget: string;
  measurements: Json;
  fit_preferences: string;
  notes: string;
  privacy_consent_at: string;
  image_paths: string[];
  status: string;
  created_at: string;
  updated_at: string;
};
type Review = {
  id: string;
  order_number: string;
  product_slug: string;
  reviewer_name: string;
  rating: number;
  fit_feedback: string;
  review_text: string;
  photo_path: string | null;
  status: string;
  created_at: string;
};
type Address = {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  sub_city: string;
  city: string;
  address: string;
  created_at: string;
  updated_at: string;
};
type Wishlist = { user_id: string; product_slug: string; created_at: string };
type Inventory = {
  product_slug: string;
  color: string;
  size: string;
  quantity: number;
  updated_at: string;
};
type Security = { user_id: string; mfa_required: boolean; updated_at: string };
type PromoCode = {
  code: string;
  percent_off: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  min_subtotal: number;
  note: string;
  created_at: string;
  updated_at: string;
};
type LiveOrders = Database["public"]["Tables"]["orders"];
// 202611060001_order_ownership.sql adds customer_user_id and 202611090001_promo_codes.sql adds
// promo_code (not yet in the generated types).
type OrderOwnership = { customer_user_id?: string | null; promo_code?: string | null };
type FeatureTables = {
  orders: {
    Row: LiveOrders["Row"] & { customer_user_id: string | null; promo_code: string | null };
    Insert: LiveOrders["Insert"] & OrderOwnership;
    Update: LiveOrders["Update"] & OrderOwnership;
    Relationships: [];
  };
  custom_commissions: Table<
    Commission,
    Omit<Commission, "id" | "created_at" | "updated_at"> &
      Partial<Pick<Commission, "id" | "created_at" | "updated_at">>
  >;
  customer_reviews: Table<
    Review,
    Omit<Review, "id" | "created_at"> & Partial<Pick<Review, "id" | "created_at">>
  >;
  account_saved_addresses: Table<
    Address,
    Omit<Address, "id" | "created_at" | "updated_at"> &
      Partial<Pick<Address, "id" | "created_at" | "updated_at">>
  >;
  account_wishlist: Table<Wishlist, Omit<Wishlist, "created_at"> & { created_at?: string }>;
  product_variant_inventory: Table<
    Inventory,
    Omit<Inventory, "quantity" | "updated_at"> & Partial<Pick<Inventory, "quantity" | "updated_at">>
  >;
  promo_codes: Table<
    PromoCode,
    Pick<PromoCode, "code" | "percent_off"> & Partial<Omit<PromoCode, "code" | "percent_off">>
  >;
  account_security_settings: Table<
    Security,
    Pick<Security, "user_id"> & Partial<Omit<Security, "user_id">>
  >;
};
export type FeatureDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: Omit<Database["public"]["Tables"], "orders"> & FeatureTables;
    Functions: Database["public"]["Functions"] & {
      place_order_with_inventory: { Args: { p_order: Json }; Returns: Json };
      account_mfa_is_required: { Args: Record<string, never>; Returns: boolean };
      set_account_mfa_required: { Args: { p_required: boolean }; Returns: undefined };
      account_session_is_verified: { Args: Record<string, never>; Returns: boolean };
    };
  };
};

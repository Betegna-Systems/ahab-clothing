import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { FeatureDatabase } from "@/lib/feature-database";

// Reuse the managed client and session; do not create a second auth client.
export const featureClient = supabase as unknown as SupabaseClient<FeatureDatabase>;

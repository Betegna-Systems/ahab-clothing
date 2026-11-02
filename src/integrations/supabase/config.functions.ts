import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const publicSupabaseConfigSchema = z.object({
  url: z.string().url(),
  anonKey: z.string().min(1),
});

export const getPublicSupabaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  const url =
    process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  const result = publicSupabaseConfigSchema.safeParse({ url, anonKey });
  if (!result.success) {
    console.error("Public Supabase configuration is missing or invalid.");
    return null;
  }

  return result.data;
});

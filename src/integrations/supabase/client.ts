import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./config.functions";
import type { Database } from "./types";

function createBrowserClient(url: string, anonKey: string) {
  return createClient<Database>(url, anonKey, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let client: ReturnType<typeof createBrowserClient> | undefined;
let clientInitialization: Promise<boolean> | undefined;

export function initializeSupabaseBrowser() {
  if (!clientInitialization) {
    clientInitialization = getPublicSupabaseConfig()
      .then((config) => {
        if (!config) return false;
        client = createBrowserClient(config.url, config.anonKey);
        return true;
      })
      .catch((error: unknown) => {
        clientInitialization = undefined;
        throw error;
      });
  }
  return clientInitialization;
}

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop, receiver) {
    if (!client) {
      throw new Error("Supabase browser client has not been initialized.");
    }
    return Reflect.get(client, prop, receiver);
  },
});

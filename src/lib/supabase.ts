import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Only ever imported from API routes / server components, so the secret key
 * never reaches the browser. There is no sign-in in this app (Maya is the only
 * user), so all reads and writes go through our own backend routes.
 */
let client: SupabaseClient | null = null;

export class ConfigError extends Error {}

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  // Supabase now issues "secret" keys (sb_secret_...); older projects use the
  // service_role JWT. Either works here.
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new ConfigError(
      "Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Copy .env.example to .env.local and fill them in.",
    );
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

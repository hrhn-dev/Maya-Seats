import { NextResponse, connection } from "next/server";
import { ConfigError, getSupabase } from "@/lib/supabase";

/**
 * Pre-flight check: writes a row to `healthcheck` and reads it back.
 * Proves the deployed app can reach the database before the clock starts.
 * Safe to delete once the real app is built.
 */
export async function GET() {
  // cacheComponents is on: this marks the handler as live (never prerendered).
  await connection();
  try {
    const db = getSupabase();
    const note = `ping ${new Date().toISOString()}`;

    const { data: written, error: writeError } = await db
      .from("healthcheck")
      .insert({ note })
      .select("id, note, created_at")
      .single();
    if (writeError) throw writeError;

    const { count, error: countError } = await db
      .from("healthcheck")
      .select("id", { count: "exact", head: true });
    if (countError) throw countError;

    return NextResponse.json({ ok: true, written, totalRows: count });
  } catch (err) {
    const message =
      err instanceof ConfigError
        ? err.message
        : "Could not reach the database. Check your Supabase URL, key and that the healthcheck table exists.";
    console.error("[health]", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

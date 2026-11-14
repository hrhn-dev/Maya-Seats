"use client";

import { useEffect, useState } from "react";

type Health =
  | { state: "loading" }
  | { state: "ok"; totalRows: number }
  | { state: "error"; message: string };

// Placeholder home page. Replace it with Maya's screen during the hour.
export default function Home() {
  const [health, setHealth] = useState<Health>({ state: "loading" });

  useEffect(() => {
    fetch("/api/health")
      .then(async (res) => {
        const body = await res.json();
        if (body.ok) setHealth({ state: "ok", totalRows: body.totalRows });
        else setHealth({ state: "error", message: body.error });
      })
      .catch(() =>
        setHealth({ state: "error", message: "Couldn't reach the server." }),
      );
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Starter is live</h1>
      <p className="text-neutral-600">
        Pre-flight check: this page writes a row to Supabase and reads it back.
      </p>
      <div className="rounded-lg border p-4 text-sm">
        {health.state === "loading" && <span>Checking database…</span>}
        {health.state === "ok" && (
          <span className="text-green-700">
            ✓ Database reachable. {health.totalRows} ping row(s) saved.
          </span>
        )}
        {health.state === "error" && (
          <span className="text-red-700">✗ {health.message}</span>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1) Cari email yang terhubung dengan username ini
    const { data: email, error: lookupError } = await supabase.rpc(
      "get_email_by_username",
      { p_username: username.trim() }
    );

    if (lookupError || !email) {
      setLoading(false);
      setError("Username atau kata sandi salah.");
      return;
    }

    // 2) Login seperti biasa menggunakan email hasil lookup
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Username atau kata sandi salah.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="market-backdrop flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/95 p-8 backdrop-blur-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold">
            AmongTani<span className="text-primary">SmartMarket</span>
          </span>
        </Link>

        <h1 className="text-center font-display text-xl font-semibold">
          Masuk ke akun Anda
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Gunakan akun yang diberikan oleh admin pasar Anda.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="admin.pasarbatu"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Kata sandi
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}

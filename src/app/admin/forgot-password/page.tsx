"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-3xl font-bold">Forgot password?</h1>
      <p className="mt-1 text-ink/60">
        Enter your email and we&rsquo;ll send you a link to set a new one.
      </p>

      {sent ? (
        <div className="mt-8 border border-ink/15 bg-ink/[0.02] p-5">
          <p className="text-sm font-medium">Check your inbox.</p>
          <p className="mt-2 text-sm text-ink/65">
            We sent a password reset link to <strong className="text-ink">{email}</strong>.
            Open it on this device.
          </p>
          <p className="mt-4 text-xs text-mute">
            Didn&rsquo;t arrive? Check spam, then{" "}
            <button
              onClick={() => setSent(false)}
              className="underline hover:text-ink"
            >
              try again
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <Link href="/admin/login" className="mt-6 inline-block text-sm text-ink/60 underline">
        ← Back to sign in
      </Link>
    </main>
  );
}

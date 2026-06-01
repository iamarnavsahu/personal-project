"use client";

import { useState, useTransition } from "react";
import { updatePasscode } from "@/app/admin/actions";

export function PasscodeUpdateForm({ galleryId }: { galleryId: string }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    { kind: "ok"; msg: string } | { kind: "err"; msg: string } | null
  >(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setStatus(null);
          const res = await updatePasscode(galleryId, fd);
          if (res?.error) {
            setStatus({ kind: "err", msg: res.error });
          } else {
            setStatus({ kind: "ok", msg: "Passcode updated ✓" });
            (document.getElementById("passcode-input") as HTMLInputElement | null)?.blur();
            setTimeout(() => setStatus(null), 3000);
          }
        })
      }
      className="mt-4 grid gap-2 border-t border-ink/10 pt-4 sm:grid-cols-[1fr_auto] sm:items-end"
    >
      <div>
        <label className="label">Change passcode</label>
        <input
          id="passcode-input"
          name="passcode"
          type="text"
          required
          minLength={4}
          placeholder="New passcode"
          className="input"
        />
      </div>
      <button className="btn btn-ghost text-sm" disabled={pending}>
        {pending ? "Updating…" : "Update passcode"}
      </button>
      {status && (
        <p
          className={`text-sm sm:col-span-2 ${
            status.kind === "ok" ? "text-green-700" : "text-red-600"
          }`}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}

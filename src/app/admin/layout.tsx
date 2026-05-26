import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-8 w-auto" />
          </Link>
          {user && (
            <form action="/admin/logout" method="post">
              <button className="text-sm text-ink/60 hover:text-ink">Sign out ({user.email})</button>
            </form>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

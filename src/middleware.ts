import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Refreshes the Supabase auth session cookies on every request.
// Skips when Supabase env vars aren't configured (e.g. fresh clone preview).
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet: { name: string; value: string; options: CookieOptions }[]) => {
        toSet.forEach(({ name, value }) => req.cookies.set(name, value));
        toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      }
    }
  });
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"]
};

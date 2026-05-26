import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refreshes the Supabase auth session cookies on every request.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => req.cookies.set(name, value));
          toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        }
      }
    }
  );
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"]
};

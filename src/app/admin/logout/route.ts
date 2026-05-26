import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

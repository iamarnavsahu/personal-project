import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

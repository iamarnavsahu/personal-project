"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function cookieName(galleryId: string) {
  return `picka_g_${galleryId}`;
}

export async function unlockGallery(slug: string, formData: FormData) {
  console.log("[unlockGallery] slug:", slug);
  const passcode = String(formData.get("passcode") || "");
  console.log("[unlockGallery] passcode length:", passcode.length);

  const admin = getSupabaseAdmin();
  const { data: gallery, error: qErr } = await admin
    .from("galleries")
    .select("id, passcode_hash")
    .eq("slug", slug)
    .single();
  if (qErr) console.error("[unlockGallery] query error:", qErr);
  if (!gallery) {
    console.error("[unlockGallery] no gallery for slug", slug);
    return { error: "Gallery not found" };
  }
  console.log("[unlockGallery] hash starts with:", gallery.passcode_hash?.slice(0, 7));

  const ok = await bcrypt.compare(passcode, gallery.passcode_hash);
  console.log("[unlockGallery] compare result:", ok);
  if (!ok) return { error: "Wrong passcode" };

  cookies().set(cookieName(gallery.id), "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  revalidatePath(`/g/${slug}`);
  return { ok: true };
}

export async function togglePick(galleryId: string, photoId: string, slug: string) {
  // Check cookie
  if (cookies().get(cookieName(galleryId))?.value !== "1") {
    return { error: "Locked" };
  }
  const admin = getSupabaseAdmin();

  // Don't allow changes after submit
  const { data: g } = await admin.from("galleries").select("is_locked").eq("id", galleryId).single();
  if (g?.is_locked) return { error: "Already submitted" };

  const { data: existing } = await admin
    .from("selections")
    .select("id")
    .eq("gallery_id", galleryId)
    .eq("photo_id", photoId)
    .maybeSingle();

  if (existing) {
    await admin.from("selections").delete().eq("id", existing.id);
  } else {
    await admin.from("selections").insert({ gallery_id: galleryId, photo_id: photoId });
  }
  revalidatePath(`/g/${slug}`);
  return { ok: true };
}

export async function submitPicks(galleryId: string, slug: string) {
  if (cookies().get(cookieName(galleryId))?.value !== "1") return { error: "Locked" };
  const admin = getSupabaseAdmin();
  await admin.from("galleries").update({ is_locked: true }).eq("id", galleryId);
  revalidatePath(`/g/${slug}`);
}

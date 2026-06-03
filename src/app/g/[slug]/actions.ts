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
    return { error: "Locked. Please enter the passcode again." };
  }
  const admin = getSupabaseAdmin();

  // is_locked + pick_limit. If the pick_limit column hasn't been added yet,
  // the second SELECT silently falls back to null (unlimited) so picking still works.
  const { data: gBase, error: gErr } = await admin
    .from("galleries")
    .select("is_locked")
    .eq("id", galleryId)
    .single();
  if (gErr) {
    console.error("[togglePick] gallery query error:", gErr);
    return { error: "Could not load gallery. Refresh and try again." };
  }
  if (gBase?.is_locked) return { error: "You've already submitted your picks." };

  let pickLimit: number | null = null;
  const { data: gLimit } = await admin
    .from("galleries")
    .select("pick_limit")
    .eq("id", galleryId)
    .single();
  if (gLimit && "pick_limit" in gLimit) {
    pickLimit = (gLimit as { pick_limit: number | null }).pick_limit ?? null;
  }

  const { data: existing, error: selErr } = await admin
    .from("selections")
    .select("id")
    .eq("gallery_id", galleryId)
    .eq("photo_id", photoId)
    .maybeSingle();
  if (selErr) {
    console.error("[togglePick] selection lookup error:", selErr);
    return { error: "Couldn't read your picks. Refresh and try again." };
  }

  if (existing) {
    // Unpick — always allowed
    const { error: delErr } = await admin
      .from("selections")
      .delete()
      .eq("id", existing.id);
    if (delErr) {
      console.error("[togglePick] delete error:", delErr);
      return { error: "Couldn't unpick. Try again." };
    }
  } else {
    // Enforce the limit if one is set
    if (pickLimit != null) {
      const { count } = await admin
        .from("selections")
        .select("id", { count: "exact", head: true })
        .eq("gallery_id", galleryId);
      if ((count ?? 0) >= pickLimit) {
        return {
          error: `You can only pick ${pickLimit} photo${pickLimit === 1 ? "" : "s"}.`
        };
      }
    }
    const { error: insErr } = await admin
      .from("selections")
      .insert({ gallery_id: galleryId, photo_id: photoId });
    if (insErr) {
      console.error("[togglePick] insert error:", insErr);
      return { error: insErr.message };
    }
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

export async function relockGallery(galleryId: string, slug: string) {
  // Wipe the unlock cookie so the next visit shows the passcode form again.
  // Useful for testing and for shared computers.
  cookies().set(cookieName(galleryId), "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  revalidatePath(`/g/${slug}`);
  return { ok: true };
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { slugify, randomSlug } from "@/lib/utils";

const BUCKET = "photos";

export async function createGallery(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const clientName = String(formData.get("client_name") || "").trim() || null;
  const passcode = String(formData.get("passcode") || "").trim();
  const rawLimit = String(formData.get("pick_limit") || "").trim();
  const pickLimit = rawLimit ? Math.max(1, parseInt(rawLimit, 10)) : null;

  if (!name) throw new Error("Name required");
  if (passcode.length < 4) throw new Error("Passcode must be at least 4 characters");

  const baseSlug = slugify(name) || "shoot";
  const slug = `${baseSlug}-${randomSlug(5)}`;
  const passcode_hash = await bcrypt.hash(passcode, 10);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("galleries")
    .insert({
      owner_id: user.id,
      slug,
      name,
      client_name: clientName,
      passcode_hash,
      pick_limit: pickLimit
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  redirect(`/admin/galleries/${data!.id}`);
}

export async function updatePickLimit(galleryId: string, formData: FormData) {
  const user = await requireUser();
  const raw = String(formData.get("pick_limit") || "").trim();
  const pick_limit = raw === "" ? null : Math.max(1, parseInt(raw, 10));
  if (pick_limit !== null && Number.isNaN(pick_limit)) {
    return { error: "Limit must be a whole number or empty" };
  }

  const admin = getSupabaseAdmin();
  const { data: gallery } = await admin
    .from("galleries")
    .select("id, slug")
    .eq("id", galleryId)
    .eq("owner_id", user.id)
    .single();
  if (!gallery) return { error: "Gallery not found" };

  const { error } = await admin
    .from("galleries")
    .update({ pick_limit })
    .eq("id", galleryId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath(`/g/${gallery.slug}`);
  return { ok: true, value: pick_limit };
}

export async function uploadPhotos(formData: FormData) {
  await requireUser();
  const galleryId = String(formData.get("galleryId") || "");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (!galleryId) throw new Error("Missing galleryId");
  if (!files.length) throw new Error("No files");
  const admin = getSupabaseAdmin();

  const { data: gallery, error: gErr } = await admin
    .from("galleries")
    .select("id, owner_id")
    .eq("id", galleryId)
    .single();
  if (gErr || !gallery) throw new Error("Gallery not found");

  // Get current max sort_order to append
  const { data: maxRow } = await admin
    .from("photos")
    .select("sort_order")
    .eq("gallery_id", galleryId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let nextOrder = (maxRow?.sort_order ?? -1) + 1;

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${galleryId}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: upErr } = await admin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { error: insErr } = await admin.from("photos").insert({
      gallery_id: galleryId,
      storage_path: path,
      filename: file.name,
      sort_order: nextOrder++
    });
    if (insErr) throw new Error(insErr.message);
  }

  revalidatePath(`/admin/galleries/${galleryId}`);
}

export async function renameGallery(galleryId: string, formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const clientName = String(formData.get("client_name") || "").trim() || null;
  if (!name) return { error: "Name can't be empty" };

  const admin = getSupabaseAdmin();
  const { data: gallery } = await admin
    .from("galleries")
    .select("id, slug")
    .eq("id", galleryId)
    .eq("owner_id", user.id)
    .single();
  if (!gallery) return { error: "Gallery not found" };

  const { error } = await admin
    .from("galleries")
    .update({ name, client_name: clientName })
    .eq("id", galleryId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath(`/g/${gallery.slug}`);
  return { ok: true };
}

export async function updatePasscode(galleryId: string, formData: FormData) {
  const user = await requireUser();
  const passcode = String(formData.get("passcode") || "").trim();
  if (passcode.length < 4) return { error: "Passcode must be at least 4 characters" };

  const admin = getSupabaseAdmin();
  const { data: gallery } = await admin
    .from("galleries")
    .select("id, slug")
    .eq("id", galleryId)
    .eq("owner_id", user.id)
    .single();
  if (!gallery) return { error: "Gallery not found" };

  const passcode_hash = await bcrypt.hash(passcode, 10);
  const { error } = await admin
    .from("galleries")
    .update({ passcode_hash })
    .eq("id", galleryId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath(`/g/${gallery.slug}`);
  return { ok: true };
}

export async function deletePhoto(photoId: string) {
  await requireUser();
  const admin = getSupabaseAdmin();
  const { data: photo } = await admin
    .from("photos")
    .select("id, gallery_id, storage_path")
    .eq("id", photoId)
    .single();
  if (!photo) return;
  await admin.storage.from(BUCKET).remove([photo.storage_path]);
  await admin.from("photos").delete().eq("id", photoId);
  revalidatePath(`/admin/galleries/${photo.gallery_id}`);
}

export async function bulkDeletePhotos(galleryId: string, photoIds: string[]) {
  const user = await requireUser();
  if (!photoIds.length) return { ok: true, deleted: 0 };
  const admin = getSupabaseAdmin();

  // Confirm gallery ownership in one round-trip
  const { data: gallery } = await admin
    .from("galleries")
    .select("id")
    .eq("id", galleryId)
    .eq("owner_id", user.id)
    .single();
  if (!gallery) return { error: "Gallery not found" };

  // Fetch storage paths for every selected photo (still inside that gallery)
  const { data: photos } = await admin
    .from("photos")
    .select("id, storage_path")
    .eq("gallery_id", galleryId)
    .in("id", photoIds);
  if (!photos?.length) return { ok: true, deleted: 0 };

  const paths = photos.map((p) => p.storage_path);
  const ids = photos.map((p) => p.id);

  // Bulk-remove from storage and DB in parallel
  await Promise.all([
    admin.storage.from(BUCKET).remove(paths),
    admin.from("photos").delete().in("id", ids)
  ]);

  revalidatePath(`/admin/galleries/${galleryId}`);
  return { ok: true, deleted: ids.length };
}

export async function deleteGallery(galleryId: string) {
  await requireUser();
  const admin = getSupabaseAdmin();
  const { data: photos } = await admin
    .from("photos")
    .select("storage_path")
    .eq("gallery_id", galleryId);
  if (photos?.length) {
    await admin.storage.from(BUCKET).remove(photos.map((p) => p.storage_path));
  }
  await admin.from("galleries").delete().eq("id", galleryId);
  redirect("/admin");
}

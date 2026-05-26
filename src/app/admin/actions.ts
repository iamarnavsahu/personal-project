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

  if (!name) throw new Error("Name required");
  if (passcode.length < 4) throw new Error("Passcode must be at least 4 characters");

  const baseSlug = slugify(name) || "shoot";
  const slug = `${baseSlug}-${randomSlug(5)}`;
  const passcode_hash = await bcrypt.hash(passcode, 10);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("galleries")
    .insert({ owner_id: user.id, slug, name, client_name: clientName, passcode_hash })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  redirect(`/admin/galleries/${data!.id}`);
}

export async function uploadPhotos(galleryId: string, files: File[]) {
  await requireUser();
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

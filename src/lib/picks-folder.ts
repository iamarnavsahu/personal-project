import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "photos";

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "photo.jpg";
}

function photoFromPick(pick: { photos: unknown }) {
  const raw = pick.photos as
    | { id: string; storage_path: string; filename: string; sort_order: number }
    | { id: string; storage_path: string; filename: string; sort_order: number }[]
    | null;
  return Array.isArray(raw) ? raw[0] : raw;
}

export function picksFolderPrefix(galleryId: string) {
  return `${galleryId}/picks`;
}

/** Numbered path for the edits folder, e.g. picks/0001-DSC_1234.jpg */
export function pickStoragePath(galleryId: string, pickNumber: number, filename: string) {
  return `${picksFolderPrefix(galleryId)}/${String(pickNumber).padStart(4, "0")}-${safeFilename(filename)}`;
}

export async function clearPicksFolder(admin: SupabaseClient, galleryId: string) {
  const prefix = picksFolderPrefix(galleryId);
  const { data: files } = await admin.storage.from(BUCKET).list(prefix);
  if (!files?.length) return;
  await admin.storage.from(BUCKET).remove(files.map((f) => `${prefix}/${f.name}`));
}

export async function syncPicksToFolder(admin: SupabaseClient, galleryId: string) {
  const { data: picks, error } = await admin
    .from("selections")
    .select("photo_id, photos!inner(id, storage_path, filename, sort_order)")
    .eq("gallery_id", galleryId);
  if (error) throw new Error(error.message);

  await clearPicksFolder(admin, galleryId);
  if (!picks?.length) return { copied: 0 };

  const sorted = [...picks]
    .map((pick) => ({ pick, photo: photoFromPick(pick) }))
    .filter((row): row is { pick: (typeof picks)[number]; photo: NonNullable<ReturnType<typeof photoFromPick>> } => !!row.photo)
    .sort((a, b) => a.photo.sort_order - b.photo.sort_order);

  let copied = 0;
  for (let i = 0; i < sorted.length; i++) {
    const { photo } = sorted[i];
    const dest = pickStoragePath(galleryId, i + 1, photo.filename);
    const { error: copyErr } = await admin.storage.from(BUCKET).copy(photo.storage_path, dest);
    if (copyErr) throw new Error(`Could not copy ${photo.filename}: ${copyErr.message}`);
    copied++;
  }
  return { copied };
}

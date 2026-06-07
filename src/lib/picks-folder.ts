import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "photos";

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "photo.jpg";
}

export function picksFolderPrefix(galleryId: string) {
  return `${galleryId}/picks`;
}

export function pickStoragePath(galleryId: string, photoId: string, filename: string) {
  return `${picksFolderPrefix(galleryId)}/${photoId.slice(0, 8)}-${safeFilename(filename)}`;
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
    .select("photo_id, photos!inner(id, storage_path, filename)")
    .eq("gallery_id", galleryId);
  if (error) throw new Error(error.message);

  await clearPicksFolder(admin, galleryId);
  if (!picks?.length) return { copied: 0 };

  let copied = 0;
  for (const pick of picks) {
    const raw = pick.photos as
      | { id: string; storage_path: string; filename: string }
      | { id: string; storage_path: string; filename: string }[]
      | null;
    const photo = Array.isArray(raw) ? raw[0] : raw;
    if (!photo) continue;
    const dest = pickStoragePath(galleryId, photo.id, photo.filename);
    const { error: copyErr } = await admin.storage.from(BUCKET).copy(photo.storage_path, dest);
    if (copyErr) throw new Error(`Could not copy ${photo.filename}: ${copyErr.message}`);
    copied++;
  }
  return { copied };
}

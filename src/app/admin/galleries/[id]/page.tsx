import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { deleteGallery } from "@/app/admin/actions";
import { thumbnailUrl } from "@/lib/storage";
import { Uploader } from "./uploader";
import { PhotosGrid } from "./photos-grid";
import { PasscodeUpdateForm } from "./passcode-update-form";

export default async function GalleryAdminPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const admin = getSupabaseAdmin();

  const { data: gallery } = await admin
    .from("galleries")
    .select("*")
    .eq("id", params.id)
    .eq("owner_id", user.id)
    .single();
  if (!gallery) notFound();

  const { data: photos } = await admin
    .from("photos")
    .select("id, storage_path, filename, sort_order")
    .eq("gallery_id", gallery.id)
    .order("sort_order");

  const { data: picks } = await admin
    .from("selections")
    .select("photo_id")
    .eq("gallery_id", gallery.id);
  const pickedIds = new Set(picks?.map((p) => p.photo_id));

  // Signed URLs for previews (1 hour). Wrap each in an image transform
  // so the browser pulls a ~400px thumbnail instead of the full-size JPEG.
  const signed = await admin.storage
    .from("photos")
    .createSignedUrls(photos?.map((p) => p.storage_path) ?? [], 3600);
  const urlMap = new Map<string, string>();
  signed.data?.forEach((s, i) => {
    if (s.signedUrl && photos?.[i]) urlMap.set(photos[i].id, thumbnailUrl(s.signedUrl, 400));
  });

  const shareUrl = `/g/${gallery.slug}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-ink/60 hover:text-ink">← All galleries</Link>
          <h1 className="mt-1 text-2xl font-bold">{gallery.name}</h1>
          {gallery.client_name && <p className="text-ink/60">for {gallery.client_name}</p>}
        </div>
        <form action={async () => { "use server"; await deleteGallery(gallery.id); }}>
          <button className="btn btn-ghost text-sm text-red-600">Delete gallery</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold">Share with your client</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <code className="block truncate rounded bg-ink/5 px-3 py-2 text-sm">{shareUrl}</code>
          <span className="text-sm text-ink/60">Passcode: set below</span>
        </div>

        <PasscodeUpdateForm galleryId={gallery.id} />
      </div>

      <div>
        <h2 className="font-semibold">Upload photos</h2>
        <Uploader galleryId={gallery.id} />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Photos ({photos?.length ?? 0})</h2>
          <p className="text-sm text-ink/60">{pickedIds.size} picked by client</p>
        </div>
        {!photos?.length ? (
          <p className="mt-4 text-ink/60">No photos yet. Upload above.</p>
        ) : (
          <div className="mt-4">
            <PhotosGrid
              galleryId={gallery.id}
              photos={photos.map((p) => ({
                id: p.id,
                filename: p.filename,
                url: urlMap.get(p.id) ?? "",
                picked: pickedIds.has(p.id)
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

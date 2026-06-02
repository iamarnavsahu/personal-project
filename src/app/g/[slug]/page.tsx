import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { thumbnailUrl } from "@/lib/storage";
import { PasscodeForm } from "./passcode-form";
import { ClientGallery } from "./client-gallery";
import { UnlockIntro } from "./unlock-intro";

export default async function PublicGalleryPage({ params }: { params: { slug: string } }) {
  const admin = getSupabaseAdmin();

  const { data: gallery, error: gErr } = await admin
    .from("galleries")
    .select("id, name, client_name, slug, is_locked")
    .eq("slug", params.slug)
    .single();
  if (gErr) console.error("[/g/[slug]] gallery query error:", gErr);
  if (!gallery) {
    console.error("[/g/[slug]] no gallery for slug:", params.slug);
    notFound();
  }

  const unlocked = cookies().get(`picka_g_${gallery.id}`)?.value === "1";

  if (!unlocked) {
    return (
      <main className="mx-auto max-w-sm px-6 py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Picka." className="h-12 w-auto" />
        <h1 className="mt-8 text-3xl font-bold">{gallery.name}</h1>
        {gallery.client_name && <p className="mt-1 text-ink/60">for {gallery.client_name}</p>}
        <p className="mt-4 text-ink/70">Enter the passcode your photographer shared with you.</p>
        <PasscodeForm slug={gallery.slug} />
      </main>
    );
  }

  const { data: photos } = await admin
    .from("photos")
    .select("id, storage_path, filename")
    .eq("gallery_id", gallery.id)
    .order("sort_order");

  const { data: picks } = await admin
    .from("selections")
    .select("photo_id")
    .eq("gallery_id", gallery.id);
  const pickedIds = new Set(picks?.map((p) => p.photo_id));

  // 1h signed URLs. Grid uses a ~600px transformed thumbnail, the
  // lightbox uses the full-size original.
  const signed = await admin.storage
    .from("photos")
    .createSignedUrls(photos?.map((p) => p.storage_path) ?? [], 3600);
  const items = (photos ?? []).map((p, i) => {
    const full = signed.data?.[i]?.signedUrl ?? "";
    return {
      id: p.id,
      filename: p.filename,
      url: full ? thumbnailUrl(full, 600) : "",
      fullUrl: full,
      picked: pickedIds.has(p.id)
    };
  });

  return (
    <>
      <UnlockIntro
        galleryId={gallery.id}
        title={gallery.name}
        clientName={gallery.client_name}
      />
      <ClientGallery
        galleryId={gallery.id}
        slug={gallery.slug}
        title={gallery.name}
        clientName={gallery.client_name}
        isLocked={gallery.is_locked}
        photos={items}
      />
    </>
  );
}

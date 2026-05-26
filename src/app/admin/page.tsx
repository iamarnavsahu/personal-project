import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export default async function AdminHome() {
  const user = await requireUser();
  const admin = getSupabaseAdmin();

  const { data: galleries } = await admin
    .from("galleries")
    .select("id, name, slug, client_name, is_locked, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Per-gallery counts
  const counts: Record<string, { photos: number; picks: number }> = {};
  if (galleries?.length) {
    const ids = galleries.map((g) => g.id);
    const [{ data: photos }, { data: picks }] = await Promise.all([
      admin.from("photos").select("gallery_id").in("gallery_id", ids),
      admin.from("selections").select("gallery_id").in("gallery_id", ids)
    ]);
    for (const id of ids) counts[id] = { photos: 0, picks: 0 };
    photos?.forEach((p) => counts[p.gallery_id].photos++);
    picks?.forEach((s) => counts[s.gallery_id].picks++);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Galleries</h1>
        <Link href="/admin/galleries/new" className="btn btn-primary">+ New gallery</Link>
      </div>

      {!galleries?.length ? (
        <div className="mt-12 rounded-lg border border-dashed border-ink/20 p-12 text-center">
          <p className="text-ink/60">No galleries yet.</p>
          <Link href="/admin/galleries/new" className="btn btn-accent mt-4">Create your first</Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {galleries.map((g) => (
            <li key={g.id} className="card hover:border-ink/30">
              <Link href={`/admin/galleries/${g.id}`} className="block">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{g.name}</h3>
                    {g.client_name && <p className="text-sm text-ink/60">for {g.client_name}</p>}
                  </div>
                  {g.is_locked && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">locked</span>}
                </div>
                <div className="mt-3 flex gap-4 text-sm text-ink/60">
                  <span>{counts[g.id]?.photos ?? 0} photos</span>
                  <span>{counts[g.id]?.picks ?? 0} picks</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

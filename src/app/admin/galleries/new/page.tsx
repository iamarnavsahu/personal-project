import { requireUser } from "@/lib/auth";
import { createGallery } from "@/app/admin/actions";

export default async function NewGalleryPage() {
  await requireUser();
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">New gallery</h1>
      <form action={createGallery} className="mt-6 space-y-4">
        <div>
          <label className="label">Gallery name</label>
          <input name="name" required className="input" placeholder="Sarah's Grad Shoot" />
        </div>
        <div>
          <label className="label">Client name <span className="text-ink/40">(optional)</span></label>
          <input name="client_name" className="input" placeholder="Sarah" />
        </div>
        <div>
          <label className="label">Passcode</label>
          <input name="passcode" required minLength={4} className="input" placeholder="at least 4 characters" />
          <p className="mt-1 text-xs text-ink/60">Share this with your client along with the link.</p>
        </div>
        <div>
          <label className="label">Pick limit <span className="text-ink/40">(optional)</span></label>
          <input name="pick_limit" type="number" min={1} placeholder="e.g. 20" className="input" />
          <p className="mt-1 text-xs text-ink/60">Cap how many photos your client can pick. Leave blank for unlimited.</p>
        </div>
        <button className="btn btn-primary w-full">Create gallery</button>
      </form>
    </div>
  );
}

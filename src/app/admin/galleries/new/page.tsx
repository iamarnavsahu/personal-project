import { requireUser } from "@/lib/auth";
import { CreateGalleryForm } from "./create-gallery-form";

export default async function NewGalleryPage() {
  await requireUser();
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">New gallery</h1>
      <p className="mt-2 text-sm text-ink/60">
        Each client gets their own gallery with a separate link and passcode.
      </p>
      <CreateGalleryForm />
    </div>
  );
}

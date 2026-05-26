import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Picka." className="h-24 w-auto" />

      <p className="mt-6 text-xl text-ink/70">
        Share a shoot. Your client picks favorites. You edit only what matters.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/admin" className="btn btn-primary">Photographer login</Link>
        <a href="#how" className="btn btn-ghost">How it works</a>
      </div>

      <section id="how" className="mt-24 grid gap-6 sm:grid-cols-3">
        <div className="card">
          <div className="text-3xl font-bold">1</div>
          <h3 className="mt-2 font-semibold">Upload</h3>
          <p className="text-sm text-ink/70">Drop in JPEG previews from your shoot.</p>
        </div>
        <div className="card">
          <div className="text-3xl font-bold">2</div>
          <h3 className="mt-2 font-semibold">Share</h3>
          <p className="text-sm text-ink/70">Send a private link + passcode to your client.</p>
        </div>
        <div className="card">
          <div className="text-3xl font-bold">3</div>
          <h3 className="mt-2 font-semibold">Edit only the picks</h3>
          <p className="text-sm text-ink/70">See exactly which photos to edit. Done.</p>
        </div>
      </section>

      <footer className="mt-24 border-t border-ink/10 pt-6 text-sm text-ink/50">
        Picka. — built for photographers.
      </footer>
    </main>
  );
}

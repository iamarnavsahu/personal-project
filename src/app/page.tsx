import Link from "next/link";
import { HeroAnimation } from "@/components/hero-animation";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* top nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
          <a href="#how" className="text-mute hover:text-ink">How it works</a>
          <Link href="/admin" className="text-ink">Sign in</Link>
        </div>
      </nav>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-mute">
            For photographers
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tightest md:text-7xl">
            Your client picks.
            <br />
            <span className="italic font-serif font-normal text-mute">You edit only what matters.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Stop sending 500-photo Drive folders. Share a private gallery,
            let your client star their favorites, and edit the keepers.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/admin" className="btn btn-primary">Start a shoot</Link>
            <a href="#how" className="btn btn-ghost">See how</a>
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-mute">
            Built for grad shoots · weddings · portraits
          </p>
        </div>

        {/* animation */}
        <div className="relative">
          <div className="aspect-[5/3] w-full">
            <HeroAnimation />
          </div>
          {/* corner ticks for "frame" feel */}
          <CornerTicks />
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-mute">How it works</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tightest md:text-5xl">
            Three steps. <span className="italic font-serif font-normal text-mute">No fuss.</span>
          </h2>

          <ol className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
            {[
              { n: "01", t: "Upload", d: "Drop JPEG previews from your shoot into a new gallery." },
              { n: "02", t: "Share", d: "Send your client a private link and a passcode." },
              { n: "03", t: "Edit the picks", d: "See exactly which photos to retouch. Skip the rest." }
            ].map((s) => (
              <li key={s.n} className="bg-paper p-8">
                <div className="font-serif text-3xl italic text-mute">{s.n}</div>
                <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-ink/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <h3 className="text-3xl font-bold tracking-tightest md:text-4xl">
            Ready for your next shoot?
          </h3>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center border border-paper px-6 py-3 text-sm font-medium uppercase tracking-wider transition hover:bg-paper hover:text-ink"
          >
            Open the app →
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs uppercase tracking-widest text-mute">
        Picka. — © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function CornerTicks() {
  const tick = "absolute h-4 w-4 border-ink";
  return (
    <>
      <div className={`${tick} left-0 top-0 border-l border-t`} />
      <div className={`${tick} right-0 top-0 border-r border-t`} />
      <div className={`${tick} bottom-0 left-0 border-b border-l`} />
      <div className={`${tick} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

import Link from "next/link";
import { HeroAnimation } from "@/components/hero-animation";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ───────────────────── NAV ───────────────────── */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
        </div>
        <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.3em]">
          <a href="#how" className="text-mute transition hover:text-ink">Process</a>
          <a href="#why" className="text-mute transition hover:text-ink">Why Picka</a>
          <Link href="/admin" className="text-ink">Sign in</Link>
        </div>
      </nav>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-10 md:py-20">
        <div className="fade-up">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-mute">
            <span className="inline-block h-px w-8 bg-ink/40" />
            For photographers
          </div>

          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.75rem)] font-bold leading-[0.92] tracking-tightest">
            Your client picks.
            <br />
            <span className="font-serif italic font-normal text-mute">
              You edit only what matters.
            </span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/70">
            Stop sending 500-photo Drive folders. Share a private gallery,
            let your client star their favorites, and edit the keepers.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/admin" className="btn btn-primary">
              Start a shoot
            </Link>
            <a href="#how" className="btn btn-ghost">
              See the process
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[5/4] w-full">
            <HeroAnimation />
          </div>
          <CornerTicks />
          <span className="absolute -bottom-6 right-0 font-serif text-xs italic text-mute md:-bottom-8">
            Fig. 01 — the pick.
          </span>
        </div>
      </section>

      {/* ───────────────────── MARQUEE ───────────────────── */}
      <section className="border-y border-ink/10 bg-ink py-3 text-paper">
        <div className="flex gap-12 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.35em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="marquee flex shrink-0 items-center gap-12">
              <span>Private galleries</span>
              <Dot />
              <span>Passcode access</span>
              <Dot />
              <span>Built for grad season</span>
              <Dot />
              <span>One link · one passcode</span>
              <Dot />
              <span>No client signup</span>
              <Dot />
              <span>Free for your first shoot</span>
              <Dot />
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ───────────────────── */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-mute">
              The process
            </p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-6xl">
              Three quiet steps.
            </h2>
            <p className="mt-6 max-w-xs text-ink/70">
              No spreadsheets. No back-and-forth. No app for your client to download.
            </p>
          </div>

          <ol className="space-y-px">
            {[
              {
                n: "01",
                t: "Upload your previews",
                d: "Drag your JPEGs into a fresh gallery. Up to a few hundred at a time. Originals stay on your drive.",
                detail: "Supabase storage, private bucket"
              },
              {
                n: "02",
                t: "Share one link",
                d: "Send your client a private URL and a 4-digit passcode. No accounts, no friction. Works on any phone.",
                detail: "Encrypted passcode · auto-expiring URLs"
              },
              {
                n: "03",
                t: "Edit only the keepers",
                d: "When they submit, you see exactly which files to retouch. Skip the rest entirely.",
                detail: "Filenames ready for Lightroom"
              }
            ].map((s) => (
              <li
                key={s.n}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-ink/10 py-8 transition-colors hover:bg-ink/[0.02] last:border-b md:gap-10 md:py-10"
              >
                <div className="font-serif text-3xl italic text-mute md:text-4xl">{s.n}</div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {s.t}
                  </h3>
                  <p className="mt-3 max-w-xl text-ink/70">{s.d}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-mute">
                    — {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────────── WHY ───────────────────── */}
      <section id="why" className="border-t border-ink/10 bg-ink/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <p className="text-[11px] uppercase tracking-[0.35em] text-mute">Why Picka</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl italic leading-[1.05] tracking-tightest md:text-6xl">
            Built for photographers who&rsquo;d rather be shooting.
          </h2>

          <ul className="mt-16 grid gap-px bg-ink/10 md:grid-cols-3">
            {[
              {
                t: "Stays private.",
                d: "Photos live in a private bucket. URLs are signed and expire. Nothing is indexable."
              },
              {
                t: "Stays simple.",
                d: "Your client taps a link, enters a passcode, taps stars. That&rsquo;s the whole flow."
              },
              {
                t: "Stays yours.",
                d: "No watermarks on the admin. No upsells. Your originals never leave your machine."
              }
            ].map((f) => (
              <li key={f.t} className="bg-paper p-8 md:p-10">
                <span className="font-serif text-3xl italic text-ink">{f.t}</span>
                <p
                  className="mt-4 text-ink/70"
                  dangerouslySetInnerHTML={{ __html: f.d }}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────────── CTA ───────────────────── */}
      <section className="border-t border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center md:px-10 md:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-paper/50">
              Ready when you are
            </p>
            <h3 className="mt-3 font-serif text-4xl italic leading-tight tracking-tightest md:text-5xl">
              Your next shoot starts here.
            </h3>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 border border-paper px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-paper hover:text-ink"
          >
            Start uploading
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <footer className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 border-t border-ink/10 pt-10 md:grid-cols-[1fr_auto_auto_auto]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-7 w-auto opacity-50" />
            <p className="mt-3 max-w-xs text-sm text-ink/60">
              A small, private tool for photographers who care.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { label: "How it works", href: "#how" },
              { label: "Why Picka", href: "#why" },
              { label: "Sign in", href: "/admin" }
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy policy", href: "/privacy" },
              { label: "Terms of use", href: "/terms" }
            ]}
          />
          <FooterCol
            title="Contact"
            links={[{ label: "asahu@ucsd.edu", href: "mailto:asahu@ucsd.edu" }]}
          />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-mute">
          <span>Picka. © {new Date().getFullYear()}</span>
          <span>Built quietly in San Diego.</span>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-mute">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink/80 transition hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CornerTicks() {
  const tick = "absolute h-4 w-4 border-ink";
  return (
    <>
      <div className={`${tick} -left-3 -top-3 border-l border-t`} />
      <div className={`${tick} -right-3 -top-3 border-r border-t`} />
      <div className={`${tick} -bottom-3 -left-3 border-b border-l`} />
      <div className={`${tick} -bottom-3 -right-3 border-b border-r`} />
    </>
  );
}

function Dot() {
  return <span className="inline-block h-1 w-1 rounded-full bg-paper/40" aria-hidden />;
}

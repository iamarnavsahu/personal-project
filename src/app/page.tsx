import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ───────────────────── NAV ───────────────────── */}
      <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="reveal reveal-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
        </div>
        <div className="reveal reveal-2 flex items-center gap-8 text-[11px] uppercase tracking-[0.3em]">
          <a href="#how" className="hidden text-mute transition hover:text-ink sm:inline">Process</a>
          <a href="#why" className="hidden text-mute transition hover:text-ink sm:inline">Why Picka</a>
          <Link href="/admin" className="text-ink">Sign in</Link>
        </div>
      </nav>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center justify-center px-6 py-16 md:px-10 md:py-24">
        {/* Floating photo cards — desktop only */}
        <FloatingCards />

        {/* Centered title block */}
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="reveal reveal-3 text-[11px] uppercase tracking-[0.4em] text-mute">
            For photographers
          </p>

          <h1 className="mt-6 font-serif text-[clamp(3.5rem,11vw,9rem)] italic leading-[0.9] tracking-tightest">
            <span className="reveal reveal-4 block">Your client</span>
            <span className="reveal reveal-5 block text-mute">picks.</span>
          </h1>

          <p className="reveal reveal-6 mx-auto mt-8 max-w-md font-serif text-lg italic text-ink/70 md:text-xl">
            You edit only what matters.
          </p>

          <div className="reveal reveal-7 mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/admin" className="btn btn-primary">
              Start a shoot
            </Link>
            <a href="#how" className="btn btn-ghost">
              See the process
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────── MARQUEE ───────────────────── */}
      <section className="border-y border-ink/10 bg-ink py-3 text-paper">
        <div className="flex gap-12 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.35em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="marquee flex shrink-0 items-center gap-12">
              <span>Private galleries</span><Dot />
              <span>Passcode access</span><Dot />
              <span>Built for grad season</span><Dot />
              <span>One link · one passcode</span><Dot />
              <span>No client signup</span><Dot />
              <span>Free for your first shoot</span><Dot />
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ───────────────────── */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-mute">The process</p>
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
                className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-ink/10 py-8 transition-colors last:border-b hover:bg-ink/[0.02] md:gap-10 md:py-10"
              >
                <div className="font-serif text-3xl italic text-mute md:text-4xl">{s.n}</div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.t}</h3>
                  <p className="mt-3 max-w-xl text-ink/70">{s.d}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-mute">— {s.detail}</p>
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
              { t: "Stays private.", d: "Photos live in a private bucket. URLs are signed and expire. Nothing is indexable." },
              { t: "Stays simple.", d: "Your client taps a link, enters a passcode, taps stars. That&rsquo;s the whole flow." },
              { t: "Stays yours.",   d: "No watermarks on the admin. No upsells. Your originals never leave your machine." }
            ].map((f) => (
              <li key={f.t} className="bg-paper p-8 md:p-10">
                <span className="font-serif text-3xl italic text-ink">{f.t}</span>
                <p className="mt-4 text-ink/70" dangerouslySetInnerHTML={{ __html: f.d }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────────── CTA ───────────────────── */}
      <section className="border-t border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center md:px-10 md:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-paper/50">Ready when you are</p>
            <h3 className="mt-3 font-serif text-4xl italic leading-tight tracking-tightest md:text-5xl">
              Your next shoot starts here.
            </h3>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 border border-paper px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-paper hover:text-ink"
          >
            Start uploading <span aria-hidden>→</span>
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
          <FooterCol title="Product" links={[
            { label: "How it works", href: "#how" },
            { label: "Why Picka", href: "#why" },
            { label: "Sign in", href: "/admin" }
          ]} />
          <FooterCol title="Legal" links={[
            { label: "Privacy policy", href: "/privacy" },
            { label: "Terms of use", href: "/terms" }
          ]} />
          <FooterCol title="Contact" links={[
            { label: "asahu@ucsd.edu", href: "mailto:asahu@ucsd.edu" }
          ]} />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-mute">
          <span>Picka. © {new Date().getFullYear()}</span>
          <span>Built quietly in San Diego.</span>
        </div>
      </footer>
    </div>
  );
}

function FloatingCards() {
  const cards = [
    { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=520&fit=crop&q=70",
      cls: "top-[6%] left-[6%] w-28 md:w-40 -rotate-[8deg] reveal-card reveal-c1" },
    { src: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=400&h=400&fit=crop&q=70",
      cls: "top-[2%] right-[8%] w-32 md:w-44 rotate-[6deg] reveal-card reveal-c2" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=560&fit=crop&q=70",
      cls: "top-[42%] left-[2%] w-24 md:w-36 -rotate-[3deg] reveal-card reveal-c3 hidden sm:block" },
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=520&fit=crop&q=70",
      cls: "top-[40%] right-[3%] w-28 md:w-40 rotate-[9deg] reveal-card reveal-c4 hidden sm:block" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=70",
      cls: "bottom-[6%] left-[18%] w-24 md:w-32 -rotate-[5deg] reveal-card reveal-c5 hidden md:block" },
    { src: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=400&h=480&fit=crop&q=70",
      cls: "bottom-[8%] right-[20%] w-24 md:w-36 rotate-[4deg] reveal-card reveal-c6 hidden md:block" }
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {cards.map((c, i) => (
        <div key={i} className={`absolute overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.25)] ring-1 ring-ink/5 ${c.cls}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt="" className="block h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-mute">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink/80 transition hover:text-ink">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dot() {
  return <span className="inline-block h-1 w-1 rounded-full bg-paper/40" aria-hidden />;
}

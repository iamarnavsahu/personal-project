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
          <a href="#how" className="hidden text-mute transition hover:text-ink sm:inline">How it works</a>
          <a href="#why" className="hidden text-mute transition hover:text-ink sm:inline">Why Picka</a>
          <Link href="/admin" className="text-ink">Sign in</Link>
        </div>
      </nav>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-16 md:px-10 md:py-24">
        <FloatingCards />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="reveal reveal-3 text-[11px] uppercase tracking-[0.4em] text-mute">
            The modern home for sharing photography
          </p>

          <h1 className="mt-6 font-serif text-[clamp(3.5rem,11vw,9rem)] italic leading-[0.9] tracking-tightest">
            <span className="reveal reveal-4 block">Share photos,</span>
            <span className="reveal reveal-5 block text-mute">not files.</span>
          </h1>

          <p className="reveal reveal-6 mx-auto mt-10 max-w-lg text-base leading-relaxed text-ink/70 md:text-lg">
            Photo delivery, reimagined. Upload a gallery, share a link &mdash;
            your people browse, search, and choose what speaks to them.
          </p>

          <div className="reveal reveal-7 mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/admin" className="btn btn-primary">
              Start a gallery
            </Link>
            <a href="#how" className="btn btn-ghost">
              See it in action
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────── MARQUEE ───────────────────── */}
      <section className="border-y border-ink/10 bg-ink py-3 text-paper">
        <div className="flex gap-12 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.35em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="marquee flex shrink-0 items-center gap-12">
              <span>Photography first</span><Dot />
              <span>No client signups</span><Dot />
              <span>One link, infinite moments</span><Dot />
              <span>Browse · favorite · share</span><Dot />
              <span>Made for the moment, not the file</span><Dot />
              <span>For grad season, weddings, all of it</span><Dot />
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ───────────────────── */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-mute">How it works</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-6xl">
              An experience, not a folder.
            </h2>
            <p className="mt-6 max-w-xs text-ink/70">
              No spreadsheets. No links labeled <em>FINAL_v3</em>. No app for your people to download.
            </p>
          </div>

          <ol className="space-y-px">
            {[
              {
                n: "01",
                t: "Upload your shoot",
                d: "Drag your photos into a fresh gallery. They&rsquo;re displayed the way they were meant to be seen.",
                detail: "Photography first, files second"
              },
              {
                n: "02",
                t: "Share one link",
                d: "Send a private URL and a passcode. No accounts. No friction. Opens like a memory on any phone.",
                detail: "Tap, browse, fall in love"
              },
              {
                n: "03",
                t: "Watch them choose",
                d: "Your people browse, star their favorites, and when they&rsquo;re done you know exactly which moments matter most.",
                detail: "The keepers, surfaced"
              }
            ].map((s) => (
              <li
                key={s.n}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-ink/10 py-8 transition-colors last:border-b hover:bg-ink/[0.02] md:gap-10 md:py-10"
              >
                <div className="font-serif text-3xl italic text-mute md:text-4xl">{s.n}</div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.t}</h3>
                  <p className="mt-3 max-w-xl text-ink/70" dangerouslySetInnerHTML={{ __html: s.d }} />
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
            Photography is the hero. Everything else stays out of the way.
          </h2>

          <ul className="mt-16 grid gap-px bg-ink/10 md:grid-cols-3">
            {[
              {
                t: "Designed to feel.",
                d: "Galleries that breathe. Full-bleed photos. No clutter, no chrome, no UI getting in the way of the work."
              },
              {
                t: "Designed to share.",
                d: "One link is the whole experience. No app, no account, no learning curve &mdash; your people just tap and arrive."
              },
              {
                t: "Designed for you.",
                d: "Private by default. Your originals never leave your machine. Your galleries, your client list, your work."
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
              For your next shoot
            </p>
            <h3 className="mt-3 font-serif text-4xl italic leading-tight tracking-tightest md:text-5xl">
              Make the gallery a moment, <br className="hidden md:block" />
              not a download.
            </h3>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 border border-paper px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-paper hover:text-ink"
          >
            Start a gallery <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <footer className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 border-t border-ink/10 pt-10 md:grid-cols-[1.5fr_auto_auto]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-7 w-auto opacity-60" />
            <p className="mt-4 max-w-xs font-serif text-lg italic text-ink/60">
              The modern home for sharing photography.
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
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" }
            ]}
          />
        </div>
        <div className="mt-10 text-[10px] uppercase tracking-[0.3em] text-mute">
          Picka. © {new Date().getFullYear()}
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
        <div
          key={i}
          className={`absolute overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.25)] ring-1 ring-ink/5 ${c.cls}`}
        >
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

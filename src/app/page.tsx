import Link from "next/link";
import { Hero } from "@/components/hero";
import { ScrollStory } from "@/components/scroll-story";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FAFAF7" }}>
      <Hero />
      <ScrollStory />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_auto_auto]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-7 w-auto opacity-70" />
            <p className="mt-5 max-w-sm font-serif text-lg italic text-ink/60">
              Share photos, not files.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Log in", href: "/admin/login" },
              { label: "Sign up", href: "/admin/login" }
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" }
            ]}
          />
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-8 text-[10px] uppercase tracking-[0.3em] text-mute">
          <span>Picka. © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
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
      <ul className="mt-5 space-y-3 text-sm">
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

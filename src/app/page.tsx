"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollStory } from "@/components/scroll-story";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper">
      <ScrollStory />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────── HOW IT WORKS ─────────────────────── */

const STEPS = [
  {
    title: "Upload",
    body: "Drop your shoot into a fresh gallery. Photos take centre stage — no filenames, no folders, no clutter.",
    Icon: UploadIcon
  },
  {
    title: "Share",
    body: "Send one private link and a passcode. No accounts, no apps. Opens like a memory on any phone.",
    Icon: ShareIcon
  },
  {
    title: "Discover",
    body: "Your people browse, search, favourite. When they finish, you see exactly which moments to bring to life.",
    Icon: HeartIcon
  }
];

function HowItWorks() {
  return (
    <section
      id="how"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 md:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.0, ease: EASE }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-mute">How it works</p>
        <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
          Three quiet steps.
        </h2>
      </motion.div>

      <div className="mt-20 grid w-full max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.15 }}
            className="group relative flex flex-col rounded-3xl border border-ink/10 bg-paper p-10 transition-all duration-500 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_30px_60px_-30px_rgba(14,14,16,0.25)] md:p-12"
          >
            <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/[0.04] transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
              <step.Icon />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-mute">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-serif text-3xl italic leading-tight tracking-tight md:text-4xl">
              {step.title}
            </h3>
            <p className="mt-5 text-ink/65 leading-relaxed">{step.body}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-24 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-mute"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────── FINAL CTA ─────────────────────── */

function FinalCTA() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center px-6 py-32 md:px-10">
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.0, ease: EASE }}
          className="flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-10 w-auto" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
          className="mt-12 font-serif text-[clamp(2.75rem,8vw,6.5rem)] italic leading-[0.95] tracking-tightest"
        >
          Share photos, <span className="text-mute">not files.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.4 }}
          className="mx-auto mt-8 max-w-xl text-base text-ink/65 md:text-lg"
        >
          Your first gallery is free. Upload a shoot, send the link, watch it
          come to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <Link
            href="/admin"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-10 py-5 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(14,14,16,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_30px_70px_-15px_rgba(14,14,16,0.55)]"
          >
            Start uploading
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-mute">
            Free · No card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── FOOTER ─────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_auto_auto]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Picka." className="h-7 w-auto opacity-70" />
            <p className="mt-5 max-w-sm font-serif text-lg italic text-ink/60">
              The modern home for sharing photography.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "How it works", href: "#how" },
              { label: "Sign in", href: "/admin" }
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
          <span>Share photos, not files.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
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

/* ─────────────────────── ICONS ─────────────────────── */

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M10 14l-5 5M5 14h5v5M14 10l5-5M19 10V5h-5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

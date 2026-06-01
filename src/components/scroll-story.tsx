"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const PHOTOS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=70",
  "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=400&h=500&fit=crop&q=70",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=500&fit=crop&q=70",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=500&fit=crop&q=70",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop&q=70",
  "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=400&h=500&fit=crop&q=70"
];
const PICKED = new Set([0, 2, 4]); // which indexes get hearts

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  /* ─── laptop ─── */
  const laptopScale = useTransform(
    scrollYProgress,
    [0,    0.08, 0.20, 0.40, 0.60, 0.78, 0.88, 0.94],
    [0.55, 0.72, 0.88, 1.02, 1.10, 1.18, 1.18, 0.7]
  );
  const laptopRotate = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.78],
    [0, -3, -3]
  );
  const laptopOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.88, 0.94],
    [0, 1, 1, 0]
  );
  const laptopY = useTransform(
    scrollYProgress,
    [0, 0.08],
    [120, 0]
  );

  /* ─── text overlays ─── */
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.08], [1, 1, 0]);
  const sec1 = useTransform(scrollYProgress, [0.10, 0.14, 0.20, 0.24], [0, 1, 1, 0]);
  const sec2 = useTransform(scrollYProgress, [0.26, 0.30, 0.36, 0.40], [0, 1, 1, 0]);
  const sec3 = useTransform(scrollYProgress, [0.42, 0.46, 0.56, 0.60], [0, 1, 1, 0]);
  const sec4 = useTransform(scrollYProgress, [0.62, 0.66, 0.72, 0.76], [0, 1, 1, 0]);
  const sec5 = useTransform(scrollYProgress, [0.78, 0.82, 0.86, 0.88], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.88, 0.94, 1], [0, 1, 1]);

  /* ─── floating photos around laptop in hero ─── */
  const floatOpacity = useTransform(scrollYProgress, [0, 0.04, 0.08, 0.12], [0, 1, 1, 0]);

  /* ─── counter ─── */
  const count = useTransform(
    scrollYProgress,
    [0.44, 0.46, 0.48, 0.50, 0.54],
    [0, 3, 8, 15, 24]
  );
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  return (
    <div ref={containerRef} className="relative" style={{ height: "700vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <Nav />

        {/* Floating photos in hero */}
        <FloatingPhotos opacity={floatOpacity} />

        {/* Laptop (the throughline) */}
        <motion.div
          style={{
            scale: laptopScale,
            rotate: laptopRotate,
            opacity: laptopOpacity,
            y: laptopY
          }}
          className="origin-center"
        >
          <Laptop progress={scrollYProgress} count={displayCount} />
        </motion.div>

        {/* Hero overlay */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[16%] z-20 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            A better way to share photos
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.75rem,8vw,6.5rem)] italic leading-[0.9] tracking-tightest">
            Share photos, <span className="text-mute">not files.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-ink/65 md:text-lg">
            Create beautiful galleries and share them with anyone.
          </p>
          <Link
            href="/admin"
            className="pointer-events-auto mt-8 inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(184,91,63,0.45)] transition-all duration-300 hover:scale-105 hover:bg-clay-soft"
          >
            Create Gallery <span aria-hidden>→</span>
          </Link>
        </motion.div>

        {/* Per-section labels at the top */}
        <SectionLabel
          opacity={sec1}
          eyebrow="01 — Upload"
          title="Upload once."
          sub="Drag. Drop. Done."
        />
        <SectionLabel
          opacity={sec2}
          eyebrow="02 — Share"
          title="Share instantly."
          sub="One gallery. One link."
        />
        <SectionLabel
          opacity={sec3}
          eyebrow="03 — Pick"
          title="Pick what matters."
          sub={`${displayCount} selected`}
          subClay
        />
        <SectionLabel
          opacity={sec4}
          eyebrow="04 — Curate"
          title="Your favorites, organised."
          sub="The keepers, surfaced."
        />
        <SectionLabel
          opacity={sec5}
          eyebrow="05 — Picka"
          title="A better way to share photos."
          sub=""
        />

        {/* Final CTA — emerges as laptop scales away */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-12 w-auto md:h-16" />
          <h2 className="mt-10 font-serif text-[clamp(2.5rem,6vw,5rem)] italic leading-[0.95] tracking-tightest">
            Ready to share your <br className="hidden md:block" />
            <span className="text-mute">first gallery?</span>
          </h2>
          <Link
            href="/admin"
            className="pointer-events-auto mt-12 inline-flex items-center gap-3 rounded-full bg-clay px-10 py-5 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(184,91,63,0.45)] transition-all duration-300 hover:scale-[1.04] hover:bg-clay-soft"
          >
            Create Gallery <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────── NAV ─────────────────────── */

function Nav() {
  return (
    <nav className="pointer-events-auto absolute inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.9, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        className="flex items-center gap-6 text-[11px] uppercase tracking-[0.3em]"
      >
        <Link
          href="/admin"
          className="rounded-full border border-ink/15 px-4 py-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          Sign in
        </Link>
      </motion.div>
    </nav>
  );
}

/* ─────────────────────── FLOATING PHOTOS (hero only) ─────────────────────── */

function FloatingPhotos({ opacity }: { opacity: MotionValue<number> }) {
  const positions = [
    "left-[6%]  top-[18%]  w-28 md:w-36 -rotate-[8deg]",
    "right-[8%] top-[14%]  w-32 md:w-40  rotate-[6deg]",
    "left-[2%]  top-[58%]  w-24 md:w-32 -rotate-[3deg] hidden sm:block",
    "right-[3%] top-[60%]  w-28 md:w-36  rotate-[9deg] hidden sm:block"
  ];
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    >
      {positions.map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.4 + i * 0.12, duration: 1.2, ease: EASE }}
          className={`absolute ${cls}`}
        >
          <motion.div
            animate={{ y: [0, -8, 0, 8, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
            className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.30)] ring-1 ring-ink/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS[i]} alt="" className="block aspect-[4/5] w-full object-cover" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────── SECTION LABEL ─────────────────────── */

function SectionLabel({
  opacity,
  eyebrow,
  title,
  sub,
  subClay
}: {
  opacity: MotionValue<number>;
  eyebrow: string;
  title: string;
  sub: string;
  subClay?: boolean;
}) {
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 top-[10%] z-20 mx-auto max-w-3xl px-6 text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-mute">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] italic leading-[0.95] tracking-tightest">
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-3 text-sm uppercase tracking-[0.3em] ${
            subClay ? "text-clay" : "text-mute"
          }`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────── LAPTOP ─────────────────────── */

function Laptop({
  progress,
  count
}: {
  progress: MotionValue<number>;
  count: number;
}) {
  return (
    <div className="relative w-[88vw] max-w-[1080px] md:w-[78vw]">
      {/* Lid */}
      <div className="relative rounded-[18px] bg-ink p-2.5 shadow-[0_50px_120px_-25px_rgba(14,14,16,0.55)] ring-1 ring-ink">
        {/* Screen */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-paper">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-ink/10 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <div className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <div className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            </div>
            <div className="ml-3 flex flex-1 items-center justify-center">
              <div className="rounded-md bg-ink/[0.05] px-3 py-1 text-[10px] text-ink/40">
                picka.app / g / sarah-grad
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Picka." className="h-4 w-auto md:h-5" />
              <div className="border-l border-ink/15 pl-3">
                <p className="text-[10px] font-semibold md:text-xs">Sarah&rsquo;s Grad</p>
                <p className="text-[9px] text-mute md:text-[10px]">for Sarah Chen</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-clay/30 bg-clay/[0.08] px-3 py-1.5">
              <HeartGlyph className="h-3 w-3 text-clay" />
              <span className="text-[10px] font-semibold tabular-nums text-clay md:text-xs">
                {count}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-clay/80 md:text-[10px]">
                picked
              </span>
            </div>
          </div>

          {/* Photo grid */}
          <div className="relative grid h-[calc(100%-3.75rem-2.25rem)] grid-cols-3 gap-1.5 p-2 md:gap-2 md:p-3">
            {PHOTOS.map((src, i) => (
              <GalleryPhoto
                key={i}
                src={src}
                index={i}
                progress={progress}
                picked={PICKED.has(i)}
              />
            ))}

            {/* Cursor — animates in section 3 */}
            <ScreenCursor progress={progress} />
          </div>
        </div>
      </div>

      {/* Base hint */}
      <div className="mx-auto h-2 w-[101%] rounded-b-[14px] bg-ink/75" />
      <div className="mx-auto -mt-1 h-1 w-12 rounded-b-md bg-ink/40" />
    </div>
  );
}

/* ─────────────────────── GALLERY PHOTO ─────────────────────── */

function GalleryPhoto({
  src,
  index,
  progress,
  picked
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  picked: boolean;
}) {
  // Photos fly in during section 1 (0.10 -> 0.20), staggered per index
  const enterStart = 0.10 + index * 0.012;
  const opacity = useTransform(
    progress,
    [enterStart, enterStart + 0.06, 0.62, 0.70],
    picked
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0.25]
  );
  const scale = useTransform(
    progress,
    [enterStart, enterStart + 0.06, 0.62, 0.70],
    picked ? [0.7, 1, 1, 1.04] : [0.7, 1, 1, 0.95]
  );
  const y = useTransform(progress, [enterStart, enterStart + 0.06], [60, 0]);
  const blur = useTransform(
    progress,
    [enterStart, enterStart + 0.06],
    ["blur(8px)", "blur(0px)"]
  );

  // Heart appears for picked photos at staggered moments during section 3
  // Picked indexes: 0, 2, 4 — show hearts at 0.46, 0.49, 0.52
  const pickIndex = picked ? [0, 2, 4].indexOf(index) : -1;
  const heartStart = picked ? 0.46 + pickIndex * 0.03 : 0;
  const heartOpacity = useTransform(
    progress,
    picked
      ? [heartStart, heartStart + 0.015, 1]
      : [0, 1],
    picked ? [0, 1, 1] : [0, 0]
  );
  const heartScale = useTransform(
    progress,
    picked ? [heartStart, heartStart + 0.01, heartStart + 0.025] : [0, 1],
    picked ? [0.4, 1.3, 1] : [0, 0]
  );

  return (
    <motion.div
      style={{ opacity, scale, y, filter: blur }}
      className="relative overflow-hidden rounded-md"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block aspect-[4/5] h-full w-full object-cover" />
      {picked && (
        <motion.div
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-clay text-paper shadow-md ring-2 ring-paper"
          aria-hidden
        >
          <HeartGlyph className="h-3.5 w-3.5" />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────────────────── CURSOR ─────────────────────── */

function ScreenCursor({ progress }: { progress: MotionValue<number> }) {
  // Cursor visible during pick section (0.42 - 0.58)
  const opacity = useTransform(
    progress,
    [0.42, 0.44, 0.55, 0.58],
    [0, 1, 1, 0]
  );

  // Cursor path: top-left → top-right → bottom-middle (hitting picked photos)
  // Grid positions: index 0 is col 1 row 1, 2 is col 3 row 1, 4 is col 2 row 2
  const left = useTransform(
    progress,
    [0.42, 0.46, 0.49, 0.52, 0.58],
    ["15%", "15%", "82%", "50%", "50%"]
  );
  const top = useTransform(
    progress,
    [0.42, 0.46, 0.49, 0.52, 0.58],
    ["25%", "25%", "25%", "75%", "75%"]
  );

  return (
    <motion.div
      style={{ opacity, left, top }}
      className="pointer-events-none absolute z-30 -translate-x-2 -translate-y-2"
      aria-hidden
    >
      <svg viewBox="0 0 18 22" className="h-5 w-5 drop-shadow-md">
        <path
          d="M2 2L16 14L9 14L7 20L2 2Z"
          fill="#0e0e10"
          stroke="#fafaf7"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────── GLYPHS ─────────────────────── */

function HeartGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.35-7-10.5C5 7.46 7.46 5 10.5 5c1.74 0 3.41.81 4.5 2.09A5.97 5.97 0 0119.5 5C22.54 5 25 7.46 25 10.5 25 16.65 18 21 12 21z" transform="translate(-1.5 0)" />
    </svg>
  );
}

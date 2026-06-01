"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const PHOTOS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop&q=75"
];
const PICKED = new Set([0, 2, 4]);

/* ───────────────────────────────────────────────────────────────
   Picka product story — one sticky laptop, five acts of text.
   Mirrors Diem: a single device persists across the scroll while
   the narrative changes around it.
   ─────────────────────────────────────────────────────────────── */

type Act = "upload" | "share" | "browse" | "pick" | "see";

const ACT_AT: Array<[number, Act]> = [
  [0.00, "upload"],
  [0.20, "share"],
  [0.40, "browse"],
  [0.58, "pick"],
  [0.78, "see"]
];

function pickAct(p: number): Act {
  let current: Act = "upload";
  for (const [threshold, act] of ACT_AT) {
    if (p >= threshold) current = act;
  }
  return current;
}

export function ScrollStory() {
  return (
    <>
      <ProductStory />
      <HowItWorksCards />
      <Finale />
    </>
  );
}

/* ─────────────── ONE big sticky scroll story ─────────────── */

function ProductStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [act, setAct] = useState<Act>("upload");
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = pickAct(v);
    if (next !== act) setAct(next);
  });

  /* Laptop stays present across all acts. It scales very gently
     so it feels like one continuous device, not jumps. */
  const laptopScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.95, 1],
    [0.92, 1.0, 1.0, 0.95]
  );
  const laptopY = useTransform(scrollYProgress, [0, 0.1], [50, 0]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  /* Subtle tilt during the "see picks" act for depth */
  const laptopRotate = useTransform(scrollYProgress, [0.78, 0.88], [0, -2]);
  /* Shift left in pick + see-picks acts to make room for the phone */
  const laptopX = useTransform(
    scrollYProgress,
    [0.40, 0.55, 0.78, 0.90],
    [0, -120, -80, -60]
  );
  const laptopMainOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.55, 0.78, 0.90],
    [1, 0.45, 0.9, 1]
  );

  /* Phone enters at the "browse" act, becomes hero in "pick", exits in "see" */
  const phoneOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.50, 0.78, 0.85],
    [0, 1, 1, 0]
  );
  const phoneX = useTransform(
    scrollYProgress,
    [0.40, 0.50, 0.78, 0.85],
    [240, 0, 0, 220]
  );
  const phoneScale = useTransform(
    scrollYProgress,
    [0.40, 0.50, 0.58, 0.70, 0.78],
    [0.85, 0.95, 1.15, 1.15, 0.95]
  );
  const phoneRotate = useTransform(
    scrollYProgress,
    [0.40, 0.50, 0.85],
    [10, -2, -6]
  );

  /* Share panel slides out in act "share" */
  const panelOpacity = useTransform(
    scrollYProgress,
    [0.20, 0.30, 0.40, 0.45],
    [0, 1, 1, 0]
  );
  const panelX = useTransform(
    scrollYProgress,
    [0.20, 0.30],
    [60, 0]
  );
  const passwordOn = useTransform(scrollYProgress, [0.30, 0.35], [0, 1]);
  const copied = useTransform(scrollYProgress, [0.36, 0.39], [0, 1]);

  /* Live counter for the "pick" act */
  const count = useTransform(
    scrollYProgress,
    [0.55, 0.62, 0.66, 0.70, 0.74],
    [0, 3, 8, 15, 24]
  );
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  /* Flying photos (act: upload) */
  const flyOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.14, 0.18],
    [0, 1, 1, 0]
  );

  return (
    <div ref={ref} className="relative" style={{ height: "560vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Flying photos converge into the laptop during upload act */}
        <FlyingPhotos opacity={flyOpacity} progress={scrollYProgress} />

        {/* Laptop — the throughline */}
        <motion.div
          style={{
            scale: laptopScale,
            y: laptopY,
            opacity: laptopOpacity
          }}
          className="relative origin-center"
        >
          <motion.div
            style={{
              x: laptopX,
              rotate: laptopRotate,
              opacity: laptopMainOpacity
            }}
            className="origin-center"
          >
            <LaptopFrame>
              <CreatorView
                progress={scrollYProgress}
                count={displayCount}
                act={act}
              />
            </LaptopFrame>
          </motion.div>
        </motion.div>

        {/* Share panel */}
        <motion.div
          style={{ opacity: panelOpacity, x: panelX }}
          className="absolute right-[6%] top-[28%] z-30 w-[280px] md:right-[12%]"
        >
          <SharePanel passwordOn={passwordOn} copied={copied} />
        </motion.div>

        {/* Phone */}
        <motion.div
          style={{
            opacity: phoneOpacity,
            x: phoneX,
            scale: phoneScale,
            rotate: phoneRotate
          }}
          className="absolute right-[4%] top-1/2 z-30 -translate-y-1/2 md:right-[12%]"
        >
          <PhoneFrame>
            <ClientView
              count={displayCount}
              progress={scrollYProgress}
              interactive
            />
          </PhoneFrame>
        </motion.div>

        {/* Section text overlays — one at a time */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 px-6 pt-[14vh] md:px-10">
          <AnimatePresence mode="wait">
            {act === "upload" && (
              <SectionCopy
                key="upload"
                eyebrow="01 — Upload"
                title="Upload once."
                sub="Drop your photos in. PICKA turns them into a clean gallery."
              />
            )}
            {act === "share" && (
              <SectionCopy
                key="share"
                eyebrow="02 — Share"
                title="Share instantly."
                sub="Send one private link. Add a password when you want control."
              />
            )}
            {act === "browse" && (
              <SectionCopy
                key="browse"
                eyebrow="03 — Browse"
                title="Anyone can browse."
                sub="No app. No account. Just open the link and view the gallery."
              />
            )}
            {act === "pick" && (
              <SectionCopy
                key="pick"
                eyebrow="04 — Pick"
                title="Pick what matters."
                sub="People save their favourites with one tap."
                pillLabel={`${displayCount} selected`}
              />
            )}
            {act === "see" && (
              <SectionCopy
                key="see"
                eyebrow="05 — See every pick"
                title="See every pick."
                sub="Open the selected set and know exactly what to deliver."
              />
            )}
          </AnimatePresence>
        </div>

        {/* Scroll affordance */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-40 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.4em] text-mute">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Section copy overlay ─────────────── */

function SectionCopy({
  eyebrow,
  title,
  sub,
  pillLabel
}: {
  eyebrow: string;
  title: string;
  sub: string;
  pillLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-mute">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,4rem)] italic leading-[0.95] tracking-tightest">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-ink/65 md:text-base">{sub}</p>
      {pillLabel && (
        <p className="mt-4 inline-block rounded-full border border-clay/30 bg-clay/[0.08] px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-clay">
          {pillLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────── Flying photos (upload act) ─────────────── */

const FLYING_FROM = [
  { x: -700, y: -300, r: -12 },
  { x:  700, y: -320, r:  10 },
  { x: -800, y:  100, r:  -6 },
  { x:  800, y:   80, r:   8 },
  { x: -500, y:  400, r:  -4 },
  { x:  500, y:  420, r:   6 }
];

function FlyingPhotos({
  opacity,
  progress
}: {
  opacity: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
    >
      {FLYING_FROM.map((from, i) => (
        <FlyingPhoto key={i} progress={progress} from={from} index={i} />
      ))}
    </motion.div>
  );
}

function FlyingPhoto({
  progress,
  from,
  index
}: {
  progress: MotionValue<number>;
  from: { x: number; y: number; r: number };
  index: number;
}) {
  const x = useTransform(progress, [0.04, 0.16], [from.x, 0]);
  const y = useTransform(progress, [0.04, 0.16], [from.y, 0]);
  const scale = useTransform(progress, [0.04, 0.16], [1, 0.18]);
  const rotate = useTransform(progress, [0.04, 0.16], [from.r, 0]);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-16 -mt-20"
      style={{ x, y, scale, rotate }}
    >
      <div className="h-40 w-32 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.30)] ring-1 ring-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS[index]} alt="" className="block h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}

/* ─────────────── Share panel ─────────────── */

function SharePanel({
  passwordOn,
  copied
}: {
  passwordOn: MotionValue<number>;
  copied: MotionValue<number>;
}) {
  const toggleBg = useTransform(passwordOn, [0, 1], ["#0e0e1018", "#C86445"]);
  const toggleX = useTransform(passwordOn, [0, 1], [2, 22]);
  const pwdHeight = useTransform(passwordOn, [0, 1], [0, 60]);
  const pwdOpacity = useTransform(passwordOn, [0.4, 1], [0, 1]);
  const copyBg = useTransform(copied, [0, 1], ["#0e0e10", "#C86445"]);
  const copyOpacity = useTransform(copied, [0, 1], [1, 0]);
  const checkOpacity = useTransform(copied, [0, 1], [0, 1]);

  return (
    <div className="rounded-2xl bg-paper p-5 shadow-[0_40px_80px_-30px_rgba(14,14,16,0.4)] ring-1 ring-ink/10">
      <p className="text-[10px] uppercase tracking-[0.3em] text-mute">Share gallery</p>
      <p className="mt-1 font-semibold">Sarah&rsquo;s Grad</p>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-mute">Link</p>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/10 bg-ink/[0.03] p-2">
          <span className="flex-1 truncate text-xs text-ink/70">picka.app/g/sarah-grad</span>
          <motion.button
            style={{ background: copyBg }}
            className="relative flex h-7 w-16 items-center justify-center rounded-md text-[10px] font-semibold uppercase tracking-wider text-paper"
          >
            <motion.span style={{ opacity: copyOpacity }}>Copy</motion.span>
            <motion.span style={{ opacity: checkOpacity }} className="absolute inset-0 flex items-center justify-center">
              ✓ Done
            </motion.span>
          </motion.button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium">Password protected</p>
          <p className="text-[10px] text-ink/50">Add an extra layer of privacy</p>
        </div>
        <motion.div style={{ background: toggleBg }} className="relative h-6 w-11 rounded-full">
          <motion.div style={{ x: toggleX }} className="absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow" />
        </motion.div>
      </div>

      <motion.div style={{ height: pwdHeight, opacity: pwdOpacity }} className="overflow-hidden">
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-mute">Passcode</p>
          <div className="mt-1.5 rounded-lg border border-ink/10 bg-ink/[0.03] p-2 font-mono text-sm tracking-widest">
            ●●●●●●
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────── Laptop frame ─────────────── */

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[90vw] max-w-[720px] md:w-[70vw]">
      <div className="rounded-[14px] bg-ink p-2 shadow-[0_50px_120px_-30px_rgba(14,14,16,0.45)] ring-1 ring-ink">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-paper">
          <div className="flex items-center gap-1.5 border-b border-ink/10 px-2.5 py-1.5">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-ink/15" />
              <div className="h-2 w-2 rounded-full bg-ink/15" />
              <div className="h-2 w-2 rounded-full bg-ink/15" />
            </div>
            <div className="ml-2 flex flex-1 items-center justify-center">
              <div className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-[8px] text-ink/40">
                picka.app / sarah-grad
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className="mx-auto h-1.5 w-[101%] rounded-b-[10px] bg-ink/75" />
      <div className="mx-auto -mt-0.5 h-0.5 w-10 rounded-b-md bg-ink/40" />
    </div>
  );
}

/* ─────────────── Phone frame ─────────────── */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[230px]">
      <div className="rounded-[2.25rem] bg-ink p-1.5 shadow-[0_50px_100px_-25px_rgba(14,14,16,0.5)] ring-1 ring-ink/30">
        <div className="relative overflow-hidden rounded-[2rem] bg-paper">
          <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[8px] font-medium text-ink/80">
            <span>9:41</span>
            <span className="ml-1 inline-block h-1 w-2.5 rounded-sm bg-ink/80" />
          </div>
          {children}
        </div>
        <div className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-ink" />
      </div>
    </div>
  );
}

/* ─────────────── Creator (laptop) view ─────────────── */

function CreatorView({
  progress,
  count,
  act
}: {
  progress: MotionValue<number>;
  count: number;
  act: Act;
}) {
  const showPicksMode = act === "see";
  return (
    <div className="flex h-[calc(100%-1.75rem)] flex-col">
      <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-3 w-auto" />
          <div className="border-l border-ink/15 pl-2">
            <p className="text-[9px] font-semibold leading-none">Sarah&rsquo;s Grad</p>
            <p className="mt-0.5 text-[7px] text-mute">for Sarah Chen</p>
          </div>
        </div>
        {showPicksMode && (
          <div className="flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/[0.08] px-2 py-0.5">
            <HeartGlyph className="h-2.5 w-2.5 text-clay" />
            <span className="text-[9px] font-semibold tabular-nums text-clay">
              {count} picked
            </span>
          </div>
        )}
      </div>

      <div className="relative grid flex-1 grid-cols-3 gap-1 p-1.5">
        {PHOTOS.map((src, i) => (
          <UploadGridPhoto
            key={i}
            src={src}
            index={i}
            progress={progress}
            dimUnpicked={showPicksMode}
            picked={PICKED.has(i)}
          />
        ))}
      </div>
    </div>
  );
}

function UploadGridPhoto({
  src,
  index,
  progress,
  dimUnpicked,
  picked
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  dimUnpicked: boolean;
  picked: boolean;
}) {
  /* Photos fade in during the upload act, staggered per index */
  const enterStart = 0.06 + index * 0.012;
  const enterOpacity = useTransform(progress, [enterStart, enterStart + 0.04], [0, 1]);
  /* In see-picks act, non-picked photos dim */
  const finalOpacity = useTransform(
    progress,
    [0.78, 0.82],
    [1, picked ? 1 : 0.2]
  );

  return (
    <motion.div
      style={{
        opacity: dimUnpicked
          ? finalOpacity
          : enterOpacity
      }}
      className={`relative overflow-hidden rounded ${
        dimUnpicked && picked ? "ring-2 ring-clay" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block aspect-[4/5] h-full w-full object-cover" />
      {dimUnpicked && picked && (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper">
          <HeartGlyph className="h-2 w-2" />
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────── Client (phone) view ─────────────── */

function ClientView({
  count,
  progress,
  interactive
}: {
  count: number;
  progress?: MotionValue<number>;
  interactive?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-ink/10 px-3 pb-2 pt-1">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-2.5 w-auto" />
          <div className="border-l border-ink/15 pl-2">
            <p className="text-[8px] font-bold leading-none">Sarah&rsquo;s Grad</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-clay/30 bg-clay/[0.08] px-1.5 py-0.5">
          <HeartGlyph className="h-2 w-2 text-clay" />
          <span className="text-[8px] font-semibold tabular-nums text-clay">{count}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 p-1.5">
        {PHOTOS.map((src, i) => (
          <ClientPhotoCell
            key={i}
            src={src}
            index={i}
            progress={progress}
            interactive={interactive}
            picked={PICKED.has(i)}
          />
        ))}
      </div>

      <div className="border-t border-ink/10 p-2">
        <div className="rounded-full bg-ink py-1.5 text-center text-[8px] font-semibold uppercase tracking-widest text-paper">
          Send picks →
        </div>
      </div>
    </div>
  );
}

function ClientPhotoCell({
  src,
  index,
  progress,
  interactive,
  picked
}: {
  src: string;
  index: number;
  progress?: MotionValue<number>;
  interactive?: boolean;
  picked: boolean;
}) {
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block aspect-square rounded-md object-cover" />
      {picked && interactive && progress && (
        <InteractiveHeart progress={progress} index={index} />
      )}
      {picked && !interactive && (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper">
          <HeartGlyph className="h-2 w-2" />
        </div>
      )}
    </div>
  );
}

function InteractiveHeart({
  progress,
  index
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const pickedIdx = [0, 2, 4].indexOf(index);
  /* Hearts pop in sequence during the pick act (0.58 - 0.74) */
  const heartStart = 0.60 + pickedIdx * 0.04;
  const heartOpacity = useTransform(
    progress,
    [heartStart, heartStart + 0.02],
    [0, 1]
  );
  const heartScale = useTransform(
    progress,
    [heartStart, heartStart + 0.015, heartStart + 0.03],
    [0.3, 1.3, 1]
  );
  return (
    <motion.div
      style={{ opacity: heartOpacity, scale: heartScale }}
      className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper"
    >
      <HeartGlyph className="h-2 w-2" />
    </motion.div>
  );
}

/* ─────────────── How it works cards ─────────────── */

function HowItWorksCards() {
  const STEPS = [
    {
      title: "Upload",
      body: "Drag your photos into a private gallery. PICKA lays them out beautifully.",
      Icon: UploadIcon
    },
    {
      title: "Share",
      body: "Send one link and a passcode. No apps. No accounts. Anyone can open it.",
      Icon: ShareIcon
    },
    {
      title: "Discover",
      body: "Your people heart their favourites. You see exactly what to deliver.",
      Icon: HeartIcon
    }
  ];
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
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

      <div className="mt-16 grid w-full max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.15 }}
            className="group relative flex flex-col rounded-3xl border border-ink/10 bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_30px_60px_-30px_rgba(200,100,69,0.35)] md:p-10"
          >
            <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.04] transition-colors duration-500 group-hover:bg-clay group-hover:text-paper">
              <step.Icon />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-mute">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-serif text-3xl italic leading-tight tracking-tight">
              {step.title}
            </h3>
            <p className="mt-4 text-ink/65 leading-relaxed">{step.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Finale ─────────────── */

function Finale() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-25%" }}
        transition={{ duration: 1.0, ease: EASE }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/logo.png"
          alt="Picka."
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
          className="h-10 w-auto md:h-14"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1.0, delay: 0.25, ease: EASE }}
          className="mt-10 font-serif text-[clamp(2.5rem,7vw,5.5rem)] italic leading-[0.95] tracking-tightest"
        >
          A better way <br className="hidden md:block" />
          to share photos.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-6 max-w-md text-base text-ink/65 md:text-lg"
        >
          Create beautiful galleries and share them with anyone.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          <Link
            href="/admin"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-clay px-10 py-5 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(200,100,69,0.45)] transition-all duration-300 hover:scale-[1.04] hover:bg-clay-soft"
          >
            Create Gallery <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────── Icons ─────────────── */

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M10 14l-5 5M5 14h5v5M14 10l5-5M19 10V5h-5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function HeartGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.35-7-10.5C5 7.46 7.46 5 10.5 5c1.74 0 3.41.81 4.5 2.09A5.97 5.97 0 0119.5 5C22.54 5 25 7.46 25 10.5 25 16.65 18 21 12 21z" transform="translate(-1.5 0)" />
    </svg>
  );
}

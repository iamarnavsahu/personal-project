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
  "/hero/photo-1.jpg",
  "/hero/photo-2.jpg",
  "/hero/photo-3.jpg",
  "/hero/photo-4.jpg",
  "/hero/photo-5.jpg",
  "/hero/photo-3.jpg"
];
const PICKED_INDEXES = [0, 2, 4];
const PICKED_SET = new Set(PICKED_INDEXES);

export function ScrollStory() {
  return (
    <>
      <Section1Upload />
      <Section2Share />
      <Section3Browse />
      <Section4Pick />
      <Section5See />
      <HowItWorks />
      <Finale />
    </>
  );
}

/* ─────────────── SECTION 1 — Upload ─────────────── */

function Section1Upload() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopScale = useTransform(scrollYProgress, [0, 0.20, 1], [0.80, 1.0, 1.0]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.08], [0.3, 1]);
  const laptopY = useTransform(scrollYProgress, [0, 0.08], [50, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <SectionHeading
          progress={scrollYProgress}
          eyebrow="01 — Upload"
          title="Upload once."
          sub="Drop your photos in. PICKA turns them into a clean gallery."
        />

        <motion.div
          style={{ scale: laptopScale, opacity: laptopOpacity, y: laptopY }}
          className="origin-center"
        >
          <LaptopFrame>
            <CreatorView mode="default" />
          </LaptopFrame>
        </motion.div>

        <FlyingPhotos progress={scrollYProgress} />
        <ScrollHint />
      </div>
    </section>
  );
}

/* ─────────────── SECTION 2 — Share ─────────────── */

function Section2Share() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopX = useTransform(scrollYProgress, [0, 0.15], [0, -140]);
  const panelOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.85, 1], [0, 1, 1, 1]);
  const panelX = useTransform(scrollYProgress, [0.05, 0.18], [80, 0]);
  const passwordOn = useTransform(scrollYProgress, [0.22, 0.32], [0, 1]);
  const copied = useTransform(scrollYProgress, [0.36, 0.46], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <SectionHeading
          progress={scrollYProgress}
          eyebrow="02 — Share"
          title="Share instantly."
          sub="Send one private link. Add a password when you want control."
        />

        <div className="relative flex items-center justify-center">
          <motion.div style={{ x: laptopX }} className="origin-center">
            <LaptopFrame>
              <CreatorView mode="default" />
            </LaptopFrame>
          </motion.div>

          <motion.div
            style={{ opacity: panelOpacity, x: panelX }}
            className="pointer-events-none absolute right-[-20px] top-1/2 z-20 w-[300px] -translate-y-1/2 md:right-[-220px]"
          >
            <SharePanel passwordOn={passwordOn} copied={copied} />
          </motion.div>
        </div>

        <ScrollHint />
      </div>
    </section>
  );
}

/* ─────────────── SECTION 3 — Browse ─────────────── */

function Section3Browse() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopScale = useTransform(scrollYProgress, [0, 0.18], [1.0, 0.85]);
  const laptopX = useTransform(scrollYProgress, [0, 0.18], [0, -120]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.5]);

  const phoneOpacity = useTransform(scrollYProgress, [0.04, 0.20], [0, 1]);
  const phoneX = useTransform(scrollYProgress, [0.04, 0.20], [260, 0]);
  const phoneRotate = useTransform(scrollYProgress, [0.04, 0.20, 0.85], [12, -2, -4]);
  const phoneScale = useTransform(scrollYProgress, [0.04, 0.20], [0.85, 1.0]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <SectionHeading
          progress={scrollYProgress}
          eyebrow="03 — Browse"
          title="Anyone can browse."
          sub="No app. No account. Just open the link and view the gallery."
        />

        <div className="relative flex items-center justify-center">
          <motion.div style={{ scale: laptopScale, x: laptopX, opacity: laptopOpacity }} className="origin-center">
            <LaptopFrame>
              <CreatorView mode="default" />
            </LaptopFrame>
          </motion.div>

          <motion.div
            style={{ opacity: phoneOpacity, x: phoneX, rotate: phoneRotate, scale: phoneScale }}
            className="absolute right-[5%] top-1/2 z-30 -translate-y-1/2 md:right-[10%]"
          >
            <PhoneFrame>
              <ClientViewStatic count={0} />
            </PhoneFrame>
          </motion.div>
        </div>

        <ScrollHint />
      </div>
    </section>
  );
}

/* ─────────────── SECTION 4 — Pick ─────────────── */

function Section4Pick() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const phoneScale = useTransform(scrollYProgress, [0, 0.15], [1.0, 1.3]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.15], [-4, 0]);

  const count = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.20, 0.28, 0.36],
    [0, 3, 8, 15, 24]
  );
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <SectionHeading
          progress={scrollYProgress}
          eyebrow="04 — Pick"
          title="Pick what matters."
          sub="People save their favourites with one tap."
          pillLabel={`${displayCount} picked`}
        />

        <motion.div
          style={{ scale: phoneScale, rotate: phoneRotate }}
          className="origin-center"
        >
          <PhoneFrame>
            <ClientViewInteractive count={displayCount} progress={scrollYProgress} pickStartProgress={0.08} />
          </PhoneFrame>
        </motion.div>

        <ScrollHint />
      </div>
    </section>
  );
}

/* ─────────────── SECTION 5 — See picks ─────────────── */

function Section5See() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopScale = useTransform(scrollYProgress, [0, 0.18], [0.88, 1.08]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.10], [0.6, 1]);
  const laptopRotate = useTransform(scrollYProgress, [0.18, 0.32], [0, -2]);

  const dimNonPicked = useTransform(scrollYProgress, [0.05, 0.20], [1, 0.18]);
  const ringOpacity = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);

  const actionsOpacity = useTransform(scrollYProgress, [0.22, 0.34, 1], [0, 1, 1]);
  const actionsY = useTransform(scrollYProgress, [0.22, 0.34], [20, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <SectionHeading
          progress={scrollYProgress}
          eyebrow="05 — See every pick"
          title="See every pick."
          sub="Open the selected set and know exactly what to deliver."
        />

        <motion.div
          style={{ scale: laptopScale, opacity: laptopOpacity, rotate: laptopRotate }}
          className="origin-center"
        >
          <LaptopFrame>
            <CreatorView
              mode="picks"
              dimNonPicked={dimNonPicked}
              ringOpacity={ringOpacity}
            />
          </LaptopFrame>
        </motion.div>

        <motion.div
          style={{ opacity: actionsOpacity, y: actionsY }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <span className="rounded-full border border-ink/15 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] shadow-sm">
            Download picks
          </span>
          <span className="rounded-full border border-ink/15 bg-paper/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] shadow-sm">
            Export list
          </span>
          <span className="rounded-full bg-clay px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-paper shadow-sm">
            Start editing
          </span>
        </motion.div>

        <ScrollHint />
      </div>
    </section>
  );
}

/* ─────────────── HOW IT WORKS (Diem-style cards) ─────────────── */

function HowItWorks() {
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
        <h2 className="font-serif text-[clamp(3rem,9vw,8rem)] italic leading-[0.9] tracking-tightest">
          How it works.
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

/* ─────────────── FINALE ─────────────── */

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
          Ready to share <br className="hidden md:block" />
          your first gallery?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
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

/* ─────────────── Section heading ─────────────── */

function SectionHeading({
  progress,
  eyebrow,
  title,
  sub,
  pillLabel
}: {
  progress: MotionValue<number>;
  eyebrow: string;
  title: string;
  sub: string;
  pillLabel?: string;
}) {
  const opacity = useTransform(progress, [0, 0.04, 0.85, 1], [0, 1, 1, 0.6]);
  const y = useTransform(progress, [0, 0.04], [20, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none mb-10 max-w-2xl text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-mute">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,4rem)] italic leading-[0.95] tracking-tightest">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/65 md:text-base">{sub}</p>
      {pillLabel && (
        <p className="mt-3 inline-block rounded-full border border-clay/30 bg-clay/[0.08] px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-clay">
          {pillLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────── Scroll hint ─────────────── */

function ScrollHint() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.4em] text-mute">
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll ↓
      </motion.div>
    </div>
  );
}

/* ─────────────── Flying photos ─────────────── */

const FLYING_FROM = [
  { x: -700, y: -300, r: -12 },
  { x:  700, y: -320, r:  10 },
  { x: -800, y:  100, r:  -6 },
  { x:  800, y:   80, r:   8 },
  { x: -500, y:  400, r:  -4 },
  { x:  500, y:  420, r:   6 }
];

function FlyingPhotos({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {FLYING_FROM.map((from, i) => (
        <FlyingPhoto key={i} progress={progress} from={from} index={i} />
      ))}
    </div>
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
  const opacity = useTransform(progress, [0, 0.04, 0.22, 0.30], [0, 1, 1, 0]);
  const x = useTransform(progress, [0.04, 0.30], [from.x, 0]);
  const y = useTransform(progress, [0.04, 0.30], [from.y, 0]);
  const scale = useTransform(progress, [0.04, 0.30], [1, 0.18]);
  const rotate = useTransform(progress, [0.04, 0.30], [from.r, 0]);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-10 -ml-16 -mt-20"
      style={{ x, y, scale, rotate, opacity }}
    >
      <div className="h-40 w-32 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.30)] ring-1 ring-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS[index]} alt="" loading="eager" className="block h-full w-full object-cover" />
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
    <div className="relative w-[88vw] max-w-[760px] md:w-[60vw]">
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
  mode,
  dimNonPicked,
  ringOpacity
}: {
  mode: "default" | "picks";
  dimNonPicked?: MotionValue<number>;
  ringOpacity?: MotionValue<number>;
}) {
  return (
    <div className="relative flex h-[calc(100%-1.75rem)] flex-col">
      <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-3 w-auto" />
          <div className="border-l border-ink/15 pl-2">
            <p className="text-[9px] font-semibold leading-none">Sarah&rsquo;s Grad</p>
            <p className="mt-0.5 text-[7px] text-mute">for Sarah Chen</p>
          </div>
        </div>
        {mode === "picks" && (
          <div className="flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/[0.08] px-2 py-0.5">
            <HeartGlyph className="h-2.5 w-2.5 text-clay" />
            <span className="text-[9px] font-semibold tabular-nums text-clay">24 picked</span>
          </div>
        )}
      </div>

      <div className="relative grid flex-1 grid-cols-3 gap-1 p-1.5">
        {PHOTOS.map((src, i) => (
          <LaptopPhoto
            key={i}
            src={src}
            picked={PICKED_SET.has(i)}
            mode={mode}
            dimNonPicked={dimNonPicked}
            ringOpacity={ringOpacity}
          />
        ))}
      </div>
    </div>
  );
}

function LaptopPhoto({
  src,
  picked,
  mode,
  dimNonPicked,
  ringOpacity
}: {
  src: string;
  picked: boolean;
  mode: "default" | "picks";
  dimNonPicked?: MotionValue<number>;
  ringOpacity?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={mode === "picks" && !picked && dimNonPicked ? { opacity: dimNonPicked } : undefined}
      className="relative overflow-hidden rounded"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" className="block aspect-[4/5] h-full w-full object-cover" />
      {mode === "picks" && picked && ringOpacity && (
        <>
          <motion.span
            style={{ opacity: ringOpacity }}
            className="pointer-events-none absolute inset-0 rounded ring-2 ring-clay"
            aria-hidden
          />
          <motion.div
            style={{ opacity: ringOpacity }}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper"
            aria-hidden
          >
            <HeartGlyph className="h-2.5 w-2.5" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

/* ─────────────── Client (phone) views ─────────────── */

function ClientViewShell({
  count,
  children
}: {
  count: number;
  children: React.ReactNode;
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
      <div className="grid grid-cols-2 gap-1 p-1.5">{children}</div>
      <div className="border-t border-ink/10 p-2">
        <div className="rounded-full bg-ink py-1.5 text-center text-[8px] font-semibold uppercase tracking-widest text-paper">
          Send picks →
        </div>
      </div>
    </div>
  );
}

/* Used in Section 3 (browse) — no scroll-driven motion, just the layout */
function ClientViewStatic({ count }: { count: number }) {
  return (
    <ClientViewShell count={count}>
      {PHOTOS.map((src, i) => (
        <div key={i} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="eager" className="block aspect-square rounded-md object-cover" />
        </div>
      ))}
    </ClientViewShell>
  );
}

/* Used in Section 4 (pick) — hearts pop, photos dim */
function ClientViewInteractive({
  count,
  progress,
  pickStartProgress
}: {
  count: number;
  progress: MotionValue<number>;
  pickStartProgress: number;
}) {
  return (
    <ClientViewShell count={count}>
      {PHOTOS.map((src, i) => (
        <PhonePhotoInteractive
          key={i}
          src={src}
          index={i}
          progress={progress}
          pickStartProgress={pickStartProgress}
          picked={PICKED_SET.has(i)}
        />
      ))}
    </ClientViewShell>
  );
}

function PhonePhotoInteractive({
  src,
  index,
  progress,
  pickStartProgress,
  picked
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  pickStartProgress: number;
  picked: boolean;
}) {
  if (!picked) {
    return <PhonePhotoUnpicked src={src} progress={progress} pickStartProgress={pickStartProgress} />;
  }
  return <PhonePhotoPicked src={src} index={index} progress={progress} pickStartProgress={pickStartProgress} />;
}

function PhonePhotoUnpicked({
  src,
  progress,
  pickStartProgress
}: {
  src: string;
  progress: MotionValue<number>;
  pickStartProgress: number;
}) {
  const dimOpacity = useTransform(
    progress,
    [pickStartProgress + 0.1, pickStartProgress + 0.2],
    [1, 0.45]
  );
  return (
    <motion.div style={{ opacity: dimOpacity }} className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" className="block aspect-square rounded-md object-cover" />
    </motion.div>
  );
}

function PhonePhotoPicked({
  src,
  index,
  progress,
  pickStartProgress
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  pickStartProgress: number;
}) {
  const pickedOrder = PICKED_INDEXES.indexOf(index);
  const heartStart = pickStartProgress + pickedOrder * 0.08;
  const heartOpacity = useTransform(progress, [heartStart, heartStart + 0.04], [0, 1]);
  const heartScale = useTransform(
    progress,
    [heartStart, heartStart + 0.025, heartStart + 0.06],
    [0.3, 1.3, 1]
  );
  const ringOpacity = useTransform(progress, [heartStart, heartStart + 0.04], [0, 1]);

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" className="block aspect-square rounded-md object-cover" />
      <motion.span
        style={{ opacity: ringOpacity }}
        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-clay"
        aria-hidden
      />
      <motion.div
        style={{ opacity: heartOpacity, scale: heartScale }}
        className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper"
        aria-hidden
      >
        <HeartGlyph className="h-2 w-2" />
      </motion.div>
    </div>
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

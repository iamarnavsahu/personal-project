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
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop&q=75",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop&q=75"
];
const PICKED = new Set([0, 2, 4]);

export function ScrollStory() {
  return (
    <>
      <Section1Upload />
      <Section2Share />
      <Section3PhoneView />
      <Section4Picking />
      <Section5SeeAll />
      <Section6Finale />
    </>
  );
}

/* ─────────────── SECTION 1 — Upload once ─────────────── */

function Section1Upload() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.85, 1.0, 1.0]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.4, 1, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "130vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <motion.div style={{ opacity: textOpacity }} className="z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">01 — Upload</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
              Upload once.
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink/65 md:text-lg">
              Drop your photos in. PICKA turns them into a clean gallery.
            </p>
          </motion.div>

          <motion.div style={{ scale: laptopScale, opacity: laptopOpacity }} className="origin-center">
            <LaptopFrame>
              <CreatorView progress={scrollYProgress} mode="upload" />
            </LaptopFrame>
          </motion.div>
        </div>

        {/* Flying photos that converge into the laptop */}
        <FlyingPhotos progress={scrollYProgress} />
      </div>
    </section>
  );
}

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
    <>
      {FLYING_FROM.map((from, i) => (
        <FlyingPhoto key={i} progress={progress} from={from} index={i} />
      ))}
    </>
  );
}

function FlyingPhoto({
  progress, from, index
}: {
  progress: MotionValue<number>;
  from: { x: number; y: number; r: number };
  index: number;
}) {
  const opacity = useTransform(progress, [0, 0.1, 0.55, 0.65], [0, 1, 1, 0]);
  const x = useTransform(progress, [0.1, 0.65], [from.x, 0]);
  const y = useTransform(progress, [0.1, 0.65], [from.y, 0]);
  const scale = useTransform(progress, [0.1, 0.65], [1, 0.2]);
  const rotate = useTransform(progress, [0.1, 0.65], [from.r, 0]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-16 -mt-20"
      style={{ x, y, opacity, scale, rotate }}
    >
      <div className="h-40 w-32 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.35)] ring-1 ring-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS[index]} alt="" className="block h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}

/* ─────────────── SECTION 2 — Share instantly ─────────────── */

function Section2Share() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopX = useTransform(scrollYProgress, [0.1, 0.35], [0, -120]);
  const panelOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const panelX = useTransform(scrollYProgress, [0.15, 0.4], [80, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const passwordOn = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const copied = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: "140vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <motion.div style={{ opacity: textOpacity }} className="z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">02 — Share</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
              Share instantly.
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink/65 md:text-lg">
              Send one private link. Add a password when you want control.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div style={{ x: laptopX }} className="origin-center">
              <LaptopFrame>
                <CreatorView progress={scrollYProgress} mode="share" />
              </LaptopFrame>
            </motion.div>

            <SharePanel
              opacity={panelOpacity}
              x={panelX}
              passwordOn={passwordOn}
              copied={copied}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SharePanel({
  opacity, x, passwordOn, copied
}: {
  opacity: MotionValue<number>;
  x: MotionValue<number>;
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
    <motion.div
      style={{ opacity, x }}
      className="absolute right-[-20px] top-[10%] z-20 w-[280px] rounded-2xl bg-paper p-5 shadow-[0_40px_80px_-30px_rgba(14,14,16,0.4)] ring-1 ring-ink/10 md:right-[-40px]"
    >
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
    </motion.div>
  );
}

/* ─────────────── SECTION 3 — Anyone can browse ─────────────── */

function Section3PhoneView() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const laptopScale = useTransform(scrollYProgress, [0.05, 0.4], [1, 0.85]);
  const laptopX = useTransform(scrollYProgress, [0.05, 0.4], [0, -100]);
  const laptopOpacity = useTransform(scrollYProgress, [0.05, 0.4], [1, 0.4]);
  const phoneOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const phoneX = useTransform(scrollYProgress, [0.1, 0.4], [200, 0]);
  const phoneRotate = useTransform(scrollYProgress, [0.1, 0.4, 0.85], [12, -2, -4]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "130vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <motion.div style={{ opacity: textOpacity }} className="z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">03 — Browse</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
              Anyone can browse.
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink/65 md:text-lg">
              No app. No account. Just open the link and view the gallery.
            </p>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div style={{ scale: laptopScale, x: laptopX, opacity: laptopOpacity }} className="origin-center">
              <LaptopFrame>
                <CreatorView progress={scrollYProgress} mode="share" />
              </LaptopFrame>
            </motion.div>

            <motion.div
              style={{ opacity: phoneOpacity, x: phoneX, rotate: phoneRotate }}
              className="absolute right-[-10px] top-1/2 z-20 -translate-y-1/2 md:right-[5%]"
            >
              <PhoneFrame>
                <ClientView count={0} />
              </PhoneFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 4 — Picking favorites ─────────────── */

function Section4Picking() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const phoneScale = useTransform(scrollYProgress, [0.05, 0.3], [1, 1.25]);
  const phoneX = useTransform(scrollYProgress, [0.05, 0.3], [0, -50]);
  const phoneRotate = useTransform(scrollYProgress, [0.05, 0.3], [-4, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);

  const count = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.45, 0.55, 0.65],
    [0, 3, 8, 15, 24]
  );
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  return (
    <section ref={ref} className="relative" style={{ height: "140vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div className="relative flex items-center justify-center">
            <motion.div
              style={{ scale: phoneScale, x: phoneX, rotate: phoneRotate }}
              className="origin-center"
            >
              <PhoneFrame>
                <ClientView count={displayCount} progress={scrollYProgress} interactive />
              </PhoneFrame>
            </motion.div>
          </div>

          <motion.div style={{ opacity: textOpacity }} className="z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">04 — Pick</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
              Pick what matters.
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink/65 md:text-lg">
              People save their favorites with one tap.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-clay">
              {displayCount} picked
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 5 — Creator sees picks ─────────────── */

function Section5SeeAll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const phoneX = useTransform(scrollYProgress, [0, 0.3], [0, 600]);
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const laptopScale = useTransform(scrollYProgress, [0.05, 0.4], [0.85, 1.05]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "130vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <motion.div style={{ opacity: textOpacity }} className="z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">05 — See every pick</p>
            <h2 className="mt-4 font-serif text-5xl italic leading-[0.95] tracking-tightest md:text-7xl">
              See every pick.
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink/65 md:text-lg">
              Open the selected set and know exactly what to deliver.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-ink/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em]">
                Download picks
              </span>
              <span className="rounded-full border border-ink/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em]">
                Export list
              </span>
              <span className="rounded-full bg-clay px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-paper">
                Start editing
              </span>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div style={{ scale: laptopScale, opacity: laptopOpacity }} className="origin-center">
              <LaptopFrame>
                <CreatorView progress={scrollYProgress} mode="picks" />
              </LaptopFrame>
            </motion.div>

            <motion.div
              style={{ x: phoneX, opacity: phoneOpacity }}
              className="absolute right-[5%] top-1/2 z-20 -translate-y-1/2"
            >
              <PhoneFrame>
                <ClientView count={24} />
              </PhoneFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SECTION 6 — Final reveal + CTA ─────────────── */

function Section6Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [0, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.25], [40, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.2], ["blur(8px)", "blur(0px)"]);

  return (
    <section ref={ref} className="relative" style={{ height: "120vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleBlur }}
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-10 w-auto md:h-14" />
          <h2 className="mt-10 font-serif text-[clamp(2.5rem,7vw,5.5rem)] italic leading-[0.95] tracking-tightest">
            A better way <br className="hidden md:block" />
            to share photos.
          </h2>
          <p className="mt-6 max-w-md text-base text-ink/65 md:text-lg">
            Create beautiful galleries and share them with anyone.
          </p>
          <Link
            href="/admin"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-clay px-10 py-5 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(200,100,69,0.45)] transition-all duration-300 hover:scale-[1.04] hover:bg-clay-soft"
          >
            Create Gallery <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── LAPTOP FRAME ─────────────── */

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[90vw] max-w-[680px] md:w-[640px]">
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

/* ─────────────── PHONE FRAME ─────────────── */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[240px]">
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

/* ─────────────── CREATOR (LAPTOP) VIEW ─────────────── */

function CreatorView({
  progress,
  mode
}: {
  progress: MotionValue<number>;
  mode: "upload" | "share" | "picks";
}) {
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
        {mode === "picks" && (
          <div className="flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/[0.08] px-2 py-0.5">
            <HeartGlyph className="h-2.5 w-2.5 text-clay" />
            <span className="text-[9px] font-semibold tabular-nums text-clay">24 picked</span>
          </div>
        )}
      </div>

      <div className="relative grid flex-1 grid-cols-3 gap-1 p-1.5">
        {PHOTOS.map((src, i) => {
          let opacity = 1;
          let scale = 1;
          let ring = "";
          if (mode === "picks") {
            const isPicked = PICKED.has(i);
            opacity = isPicked ? 1 : 0.2;
            scale = isPicked ? 1.02 : 0.95;
            ring = isPicked ? "ring-2 ring-clay" : "";
          }
          return (
            <UploadGridPhoto
              key={i}
              src={src}
              index={i}
              progress={progress}
              mode={mode}
              forcedOpacity={opacity}
              forcedScale={scale}
              ring={ring}
              picked={PICKED.has(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

function UploadGridPhoto({
  src, index, progress, mode, forcedOpacity, forcedScale, ring, picked
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  mode: "upload" | "share" | "picks";
  forcedOpacity: number;
  forcedScale: number;
  ring: string;
  picked: boolean;
}) {
  // For upload mode, photos enter via the flying converge animation.
  // For other modes, they're just visible.
  const uploadOpacity = useTransform(
    progress,
    [0.42, 0.55],
    [0, 1]
  );

  if (mode === "upload") {
    return (
      <motion.div style={{ opacity: uploadOpacity }} className="relative overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block aspect-[4/5] h-full w-full object-cover" />
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: forcedOpacity, scale: forcedScale }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`relative overflow-hidden rounded ${ring}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block aspect-[4/5] h-full w-full object-cover" />
      {mode === "picks" && picked && (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper">
          <HeartGlyph className="h-2 w-2" />
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────── CLIENT (PHONE) VIEW ─────────────── */

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
  src, index, progress, interactive, picked
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
  progress, index
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const pickedIdx = [0, 2, 4].indexOf(index);
  const heartStart = 0.30 + pickedIdx * 0.05;
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

function HeartGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.35-7-10.5C5 7.46 7.46 5 10.5 5c1.74 0 3.41.81 4.5 2.09A5.97 5.97 0 0119.5 5C22.54 5 25 7.46 25 10.5 25 16.65 18 21 12 21z" transform="translate(-1.5 0)" />
    </svg>
  );
}

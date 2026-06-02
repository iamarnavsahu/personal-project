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
  "/hero/photo-1.jpg",
  "/hero/photo-2.jpg",
  "/hero/photo-3.jpg",
  "/hero/photo-4.jpg",
  "/hero/photo-1.jpg",
  "/hero/photo-3.jpg"
];
const PICKED_INDEXES = [0, 2, 4];
const PICKED_SET = new Set(PICKED_INDEXES);

type Act = "upload" | "share" | "browse" | "pick" | "see" | "reveal";

const ACT_AT: Array<[number, Act]> = [
  [0.00, "upload"],
  [0.17, "share"],
  [0.34, "browse"],
  [0.50, "pick"],
  [0.68, "see"],
  [0.86, "reveal"]
];

function pickAct(p: number): Act {
  let current: Act = "upload";
  for (const [threshold, act] of ACT_AT) {
    if (p >= threshold) current = act;
  }
  return current;
}

export function ScrollStory() {
  return <ProductStory />;
}

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

  /* Laptop fades + zooms in by 0.10, stays present, repositions per act */
  const laptopScale = useTransform(
    scrollYProgress,
    [0,    0.10, 0.17, 0.34, 0.50, 0.68, 0.86, 1.00],
    [0.82, 0.96, 1.00, 1.00, 0.88, 1.04, 0.86, 0.86]
  );
  const laptopY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.08, 0.10], [0, 0.4, 1]);
  const laptopX = useTransform(
    scrollYProgress,
    [0.17, 0.30, 0.34, 0.50, 0.68, 0.86, 1.00],
    [0,    -100, -100, -120, 0,    -140, -140]
  );
  const laptopRotate = useTransform(
    scrollYProgress,
    [0.68, 0.74, 0.86],
    [0, -2, -2]
  );

  /* Phone enters at browse, leaves at see, comes back at reveal */
  const phoneOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.66, 0.74, 0.86, 0.92],
    [0,    1,    1,    0,    1,    1]
  );
  const phoneX = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.50, 0.66, 0.86, 1.00],
    [260,  0,    -40,  -40,  140,  140]
  );
  const phoneScale = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.50, 0.66, 0.86, 1.00],
    [0.82, 0.92, 1.10, 1.10, 0.86, 0.86]
  );
  const phoneRotate = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.50, 0.86],
    [12,   -2,   0,    -3]
  );

  /* Share panel (act share, 0.17 - 0.34) */
  const panelOpacity = useTransform(
    scrollYProgress,
    [0.17, 0.22, 0.30, 0.34],
    [0, 1, 1, 0]
  );
  const panelX = useTransform(scrollYProgress, [0.17, 0.22], [60, 0]);
  const passwordOn = useTransform(scrollYProgress, [0.24, 0.27], [0, 1]);
  const copied = useTransform(scrollYProgress, [0.29, 0.32], [0, 1]);

  /* Counter (pick act, 0.50 - 0.68) */
  const count = useTransform(
    scrollYProgress,
    [0.50, 0.54, 0.58, 0.62, 0.66],
    [0, 3, 8, 15, 24]
  );
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  /* Flying photos converge (upload act, 0.0 - 0.10) */
  const flyOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.08, 0.10],
    [0, 1, 1, 0]
  );

  /* Action buttons (see act, 0.68 - 0.86) */
  const actionsOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.76, 0.84, 0.88],
    [0, 1, 1, 0]
  );

  return (
    <div ref={ref} className="relative" style={{ height: "700vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Flying photos converge into the laptop */}
        <FlyingPhotos opacity={flyOpacity} progress={scrollYProgress} />

        {/* Laptop — present throughout */}
        <motion.div
          style={{
            scale: laptopScale,
            y: laptopY,
            opacity: laptopOpacity,
            x: laptopX,
            rotate: laptopRotate
          }}
          className="relative origin-center"
        >
          <LaptopFrame>
            <CreatorView progress={scrollYProgress} count={displayCount} act={act} />
          </LaptopFrame>
        </motion.div>

        {/* Phone — joins from browse, becomes hero in pick, returns in reveal */}
        <motion.div
          style={{
            opacity: phoneOpacity,
            x: phoneX,
            scale: phoneScale,
            rotate: phoneRotate
          }}
          className="absolute right-[4%] top-1/2 z-30 -translate-y-1/2 md:right-[10%]"
        >
          <PhoneFrame>
            <ClientView count={displayCount} progress={scrollYProgress} />
          </PhoneFrame>
        </motion.div>

        {/* Share panel — share act */}
        <motion.div
          style={{ opacity: panelOpacity, x: panelX }}
          className="pointer-events-none absolute right-[6%] top-[22%] z-30 w-[280px] md:right-[8%]"
        >
          <SharePanel passwordOn={passwordOn} copied={copied} />
        </motion.div>

        {/* Action pills — see act */}
        <motion.div
          style={{ opacity: actionsOpacity }}
          className="pointer-events-none absolute bottom-[14vh] left-1/2 z-40 flex -translate-x-1/2 gap-3"
        >
          <span className="rounded-full border border-ink/15 bg-paper/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] backdrop-blur">
            Download picks
          </span>
          <span className="rounded-full border border-ink/15 bg-paper/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] backdrop-blur">
            Export list
          </span>
          <span className="rounded-full bg-clay px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-paper">
            Start editing
          </span>
        </motion.div>

        {/* Text overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-[7vh] z-40 px-6 md:px-10">
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
                pillLabel={`${displayCount} picked`}
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
            {act === "reveal" && <RevealOverlay key="reveal" />}
          </AnimatePresence>
        </div>

        {/* Scroll affordance */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.4em] text-mute">
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-mute">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,4rem)] italic leading-[0.95] tracking-tightest">
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mt-4 max-w-md text-sm text-ink/65 md:text-base">{sub}</p>
      )}
      {pillLabel && (
        <p className="mt-4 inline-block rounded-full border border-clay/30 bg-clay/[0.08] px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-clay">
          {pillLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────── Reveal overlay (final act + CTA) ─────────────── */

function RevealOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto max-w-3xl text-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Picka." className="mx-auto h-9 w-auto md:h-12" />
      <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,4rem)] italic leading-[0.95] tracking-tightest">
        A better way to share photos.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/65 md:text-base">
        Create beautiful galleries and share them with anyone.
      </p>
      <Link
        href="/admin"
        className="pointer-events-auto mt-6 inline-flex items-center gap-3 rounded-full bg-clay px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(200,100,69,0.45)] transition-all duration-300 hover:scale-[1.04] hover:bg-clay-soft"
      >
        Create Gallery <span aria-hidden>→</span>
      </Link>
    </motion.div>
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
  const x = useTransform(progress, [0.02, 0.10], [from.x, 0]);
  const y = useTransform(progress, [0.02, 0.10], [from.y, 0]);
  const scale = useTransform(progress, [0.02, 0.10], [1, 0.18]);
  const rotate = useTransform(progress, [0.02, 0.10], [from.r, 0]);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-16 -mt-20"
      style={{ x, y, scale, rotate }}
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
    <div className="relative w-[92vw] max-w-[820px] md:w-[72vw]">
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
  const showCounter = act === "pick" || act === "see" || act === "reveal";
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
        {showCounter && (
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
          <LaptopPhoto
            key={i}
            src={src}
            progress={progress}
            picked={PICKED_SET.has(i)}
          />
        ))}
      </div>
    </div>
  );
}

function LaptopPhoto({
  src,
  progress,
  picked
}: {
  src: string;
  progress: MotionValue<number>;
  picked: boolean;
}) {
  /* Dim non-picked photos during the "see every pick" act */
  const dimOpacity = useTransform(
    progress,
    [0.66, 0.72, 0.86, 0.92],
    picked ? [1, 1, 1, 1] : [1, 0.18, 0.18, 0.5]
  );
  /* Picked photos get a clay ring during see/reveal */
  const ringOpacity = useTransform(
    progress,
    [0.66, 0.72, 0.86, 0.96],
    picked ? [0, 1, 1, 0.7] : [0, 0, 0, 0]
  );

  return (
    <motion.div
      style={{ opacity: dimOpacity }}
      className="relative overflow-hidden rounded"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" className="block aspect-[4/5] h-full w-full object-cover" />
      {picked && (
        <motion.span
          style={{ opacity: ringOpacity }}
          className="pointer-events-none absolute inset-0 rounded ring-2 ring-clay"
          aria-hidden
        />
      )}
      {picked && (
        <motion.div
          style={{ opacity: ringOpacity }}
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper"
          aria-hidden
        >
          <HeartGlyph className="h-2.5 w-2.5" />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────────── Client (phone) view ─────────────── */

function ClientView({
  count,
  progress
}: {
  count: number;
  progress: MotionValue<number>;
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
          <PhonePhoto
            key={i}
            src={src}
            index={i}
            progress={progress}
            picked={PICKED_SET.has(i)}
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

function PhonePhoto({
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
  /* Hearts pop during pick act (0.50 - 0.66) on three picked photos in sequence */
  const pickedOrder = picked ? PICKED_INDEXES.indexOf(index) : -1;
  const heartStart = picked ? 0.52 + pickedOrder * 0.04 : 0;
  const heartOpacity = useTransform(
    progress,
    picked ? [heartStart, heartStart + 0.02] : [0, 1],
    picked ? [0, 1] : [0, 0]
  );
  const heartScale = useTransform(
    progress,
    picked ? [heartStart, heartStart + 0.015, heartStart + 0.03] : [0, 1],
    picked ? [0.3, 1.3, 1] : [0, 0]
  );
  /* Dim non-picked during pick act */
  const dimOpacity = useTransform(
    progress,
    [0.56, 0.62],
    picked ? [1, 1] : [1, 0.45]
  );
  /* Clay ring on picked photos */
  const ringOpacity = useTransform(
    progress,
    picked ? [heartStart, heartStart + 0.02] : [0, 1],
    picked ? [0, 1] : [0, 0]
  );

  return (
    <motion.div style={{ opacity: dimOpacity }} className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" className="block aspect-square rounded-md object-cover" />
      {picked && (
        <motion.span
          style={{ opacity: ringOpacity }}
          className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-clay"
          aria-hidden
        />
      )}
      {picked && (
        <motion.div
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-paper shadow ring-1 ring-paper"
          aria-hidden
        >
          <HeartGlyph className="h-2 w-2" />
        </motion.div>
      )}
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

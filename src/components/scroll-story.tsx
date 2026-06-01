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

/**
 * Scroll story: one tall section, one sticky canvas, five acts.
 *
 * Acts (mapped to scrollYProgress):
 *  0.00 - 0.18  : Hero. Cards scattered around the headline.
 *  0.18 - 0.40  : Zoom + drift. Title rises out, cards push forward.
 *  0.40 - 0.58  : Gallery. Cards organise into a clean grid.
 *  0.58 - 0.78  : Pick. Hearts pop, the "24 selected" counter ticks up.
 *  0.78 - 1.00  : Queue. Picked cards line up; the rest fade away.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "hero" | "zoom" | "grid" | "pick" | "queue";
const PHASES: Record<Phase, number> = {
  hero: 0,
  zoom: 0.22,
  grid: 0.46,
  pick: 0.66,
  queue: 0.9
};

// Each card has a value at each phase: { x, y, scale, rotate, opacity }
type Frame = { x: number; y: number; scale: number; rotate: number; opacity: number };

type CardDef = {
  src: string;
  // pixel offsets from the centre of the sticky canvas
  hero: Frame;
  zoom: Frame;
  grid: Frame;
  pick: Frame;
  queue: Frame;
  picked: boolean;
};

// Grid is 3 columns × 2 rows around centre.
const GRID = {
  col: 220, // gap between columns
  row: 270  // gap between rows
};

// Queue is 3 cards lined up horizontally at centre.
const QUEUE_X = 280;

const CARDS: CardDef[] = [
  // Card 0 — PICKED. Top-left scattered → grid TL → queue centre-left.
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=440&h=560&fit=crop&q=70",
    picked: true,
    hero:  { x: -460, y: -200, scale: 1.00, rotate: -8, opacity: 1 },
    zoom:  { x: -360, y: -120, scale: 1.30, rotate: -4, opacity: 1 },
    grid:  { x: -GRID.col, y: -GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x: -GRID.col, y: -GRID.row / 2, scale: 1.06, rotate: 0, opacity: 1 },
    queue: { x: -QUEUE_X, y: 0, scale: 1.10, rotate: 0, opacity: 1 }
  },
  // Card 1 — NOT picked. Top-right → grid TM → fade away.
  {
    src: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=440&h=440&fit=crop&q=70",
    picked: false,
    hero:  { x:  420, y: -220, scale: 1.00, rotate:  6, opacity: 1 },
    zoom:  { x:  320, y: -140, scale: 1.30, rotate:  3, opacity: 1 },
    grid:  { x:     0, y: -GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x:     0, y: -GRID.row / 2, scale: 0.96, rotate: 0, opacity: 0.45 },
    queue: { x:   140, y: -260, scale: 0.85, rotate:  4, opacity: 0 }
  },
  // Card 2 — PICKED. Mid-left → grid TR → queue centre.
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=440&h=580&fit=crop&q=70",
    picked: true,
    hero:  { x: -520, y:   60, scale: 1.00, rotate: -3, opacity: 1 },
    zoom:  { x: -360, y:   20, scale: 1.30, rotate: -2, opacity: 1 },
    grid:  { x:  GRID.col, y: -GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x:  GRID.col, y: -GRID.row / 2, scale: 1.06, rotate: 0, opacity: 1 },
    queue: { x:    0, y: 0, scale: 1.10, rotate: 0, opacity: 1 }
  },
  // Card 3 — NOT picked. Mid-right → grid BL → fades.
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=440&h=540&fit=crop&q=70",
    picked: false,
    hero:  { x:  500, y:   80, scale: 1.00, rotate:  9, opacity: 1 },
    zoom:  { x:  340, y:   40, scale: 1.30, rotate:  5, opacity: 1 },
    grid:  { x: -GRID.col, y:  GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x: -GRID.col, y:  GRID.row / 2, scale: 0.96, rotate: 0, opacity: 0.45 },
    queue: { x: -180, y:  300, scale: 0.85, rotate: -5, opacity: 0 }
  },
  // Card 4 — PICKED. Bottom-left → grid BM → queue centre-right.
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=440&h=440&fit=crop&q=70",
    picked: true,
    hero:  { x: -300, y:  280, scale: 1.00, rotate: -5, opacity: 1 },
    zoom:  { x: -200, y:  180, scale: 1.30, rotate: -2, opacity: 1 },
    grid:  { x:     0, y:  GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x:     0, y:  GRID.row / 2, scale: 1.06, rotate: 0, opacity: 1 },
    queue: { x:  QUEUE_X, y: 0, scale: 1.10, rotate: 0, opacity: 1 }
  },
  // Card 5 — NOT picked. Bottom-right → grid BR → fades.
  {
    src: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=440&h=520&fit=crop&q=70",
    picked: false,
    hero:  { x:  320, y:  300, scale: 1.00, rotate:  4, opacity: 1 },
    zoom:  { x:  220, y:  200, scale: 1.30, rotate:  2, opacity: 1 },
    grid:  { x:  GRID.col, y:  GRID.row / 2, scale: 1.00, rotate: 0, opacity: 1 },
    pick:  { x:  GRID.col, y:  GRID.row / 2, scale: 0.96, rotate: 0, opacity: 0.45 },
    queue: { x:  200, y:  300, scale: 0.85, rotate:  4, opacity: 0 }
  }
];

const PHASE_KEYS: Phase[] = ["hero", "zoom", "grid", "pick", "queue"];
const PHASE_POINTS = PHASE_KEYS.map((k) => PHASES[k]);

function field(card: CardDef, key: keyof Frame): number[] {
  return PHASE_KEYS.map((p) => card[p][key]);
}

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Title fades and rises out as we leave the hero.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.22], [0, -80]);
  const titleBlur = useTransform(
    scrollYProgress,
    [0, 0.12, 0.22],
    ["blur(0px)", "blur(0px)", "blur(8px)"]
  );

  // "Your gallery." label visible during grid phase.
  const galleryLabel = useTransform(
    scrollYProgress,
    [0.36, 0.46, 0.62, 0.7],
    [0, 1, 1, 0]
  );

  // Counter: 0 -> 24 between pick start and pick end.
  const count = useTransform(scrollYProgress, [0.58, 0.72], [0, 24]);
  const [displayCount, setDisplayCount] = useState(0);
  useMotionValueEvent(count, "change", (v) => setDisplayCount(Math.round(v)));

  // Counter chip visibility.
  const counterOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.62, 0.86, 0.92],
    [0, 1, 1, 0]
  );

  // Final "Ready to edit." label.
  const queueLabel = useTransform(
    scrollYProgress,
    [0.82, 0.9, 1],
    [0, 1, 1]
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "560vh" }}>
      {/* Sticky canvas */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Floating photo cards */}
        <div className="absolute inset-0">
          {CARDS.map((card, i) => (
            <ScrollCard key={i} card={card} progress={scrollYProgress} />
          ))}
        </div>

        {/* Title block (act 1) */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleBlur }}
          className="relative z-20 mx-auto max-w-3xl px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
            className="text-[11px] uppercase tracking-[0.4em] text-mute"
          >
            The modern home for sharing photography
          </motion.p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,9vw,8rem)] italic leading-[0.92] tracking-tightest">
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 1, ease: EASE }}
              className="block"
            >
              Share photos,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.15, duration: 1, ease: EASE }}
              className="block text-mute"
            >
              not files.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.7, duration: 1.0, ease: EASE }}
            className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-ink/70 md:text-lg"
          >
            Upload a gallery, send one link, and let people explore, favorite,
            and discover the moments that matter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.9, ease: EASE }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/admin" className="btn btn-primary">
              Start a shoot
            </Link>
            <a href="#how" className="btn btn-ghost">
              See the process
            </a>
          </motion.div>
        </motion.div>

        {/* "Your gallery." label (act 3) */}
        <motion.div
          style={{ opacity: galleryLabel }}
          className="absolute top-[10%] left-1/2 z-10 -translate-x-1/2 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Your gallery
          </p>
          <p className="mt-2 font-serif text-3xl italic text-ink md:text-4xl">
            Every frame, in its place.
          </p>
        </motion.div>

        {/* Counter (act 4) */}
        <motion.div
          style={{ opacity: counterOpacity }}
          className="absolute bottom-[12%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-ink/10 bg-paper/95 px-5 py-3 shadow-lg backdrop-blur"
        >
          <HeartIcon className="h-4 w-4 text-clay" />
          <span className="font-serif text-2xl italic tabular-nums">
            {displayCount}
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-mute">
            selected
          </span>
        </motion.div>

        {/* "Ready to edit." label (act 5) */}
        <motion.div
          style={{ opacity: queueLabel }}
          className="absolute top-[12%] left-1/2 z-10 -translate-x-1/2 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            The keepers
          </p>
          <p className="mt-2 font-serif text-3xl italic text-ink md:text-4xl">
            Ready to edit.
          </p>
        </motion.div>

        {/* Top nav stays present throughout */}
        <nav className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
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
            className="flex items-center gap-8 text-[11px] uppercase tracking-[0.3em]"
          >
            <a href="#how" className="hidden text-mute transition hover:text-ink sm:inline">How it works</a>
            <a href="#why" className="hidden text-mute transition hover:text-ink sm:inline">Why Picka</a>
            <Link href="/admin" className="text-ink">Sign in</Link>
          </motion.div>
        </nav>
      </div>
    </div>
  );
}

function ScrollCard({
  card,
  progress
}: {
  card: CardDef;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, PHASE_POINTS, field(card, "x"));
  const y = useTransform(progress, PHASE_POINTS, field(card, "y"));
  const scale = useTransform(progress, PHASE_POINTS, field(card, "scale"));
  const rotate = useTransform(progress, PHASE_POINTS, field(card, "rotate"));
  const opacity = useTransform(progress, PHASE_POINTS, field(card, "opacity"));

  // Subtle continuous drift overlay (on top of scroll-driven transforms)
  // We animate the inner wrapper to add a gentle bob.
  const heartOpacity = useTransform(
    progress,
    [PHASES.grid + 0.02, PHASES.pick + 0.02, PHASES.queue + 0.02, 1],
    [0, card.picked ? 1 : 0, card.picked ? 1 : 0, card.picked ? 1 : 0]
  );
  const heartScale = useTransform(
    progress,
    [PHASES.grid + 0.02, PHASES.pick + 0.05, PHASES.pick + 0.1],
    [0.4, 1.25, 1]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        y,
        scale,
        rotate,
        opacity,
        translateX: "-50%",
        translateY: "-50%"
      }}
      className="will-change-transform"
    >
      <motion.div
        animate={{ y: [0, -6, 0, 6, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        className="relative w-40 md:w-48"
      >
        <div className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.30)] ring-1 ring-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt=""
            className="block aspect-[4/5] w-full object-cover"
          />
        </div>

        {/* Heart badge — appears for picked cards starting at pick phase */}
        <motion.div
          style={{ opacity: heartOpacity, scale: heartScale }}
          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-clay text-paper shadow-lg ring-2 ring-paper"
          aria-hidden
        >
          <HeartIcon className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.35-7-10.5C5 7.46 7.46 5 10.5 5c1.74 0 3.41.81 4.5 2.09A5.97 5.97 0 0119.5 5C22.54 5 25 7.46 25 10.5 25 16.65 18 21 12 21z" transform="translate(-1.5 0)" />
    </svg>
  );
}

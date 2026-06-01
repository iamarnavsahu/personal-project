"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const HEADLINE = ["Share", "photos,", "not", "files."];

type Card = {
  src: string;
  cls: string;
  rotate: number;
  // entry vector
  from: { x: number; y: number };
  delay: number;
  // gentle drift (px)
  drift: { x: number; y: number; rotate: number; dur: number };
  picked?: boolean;
  pickDelay?: number;
};

const CARDS: Card[] = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=420&h=540&fit=crop&q=70",
    cls: "top-[6%] left-[6%] w-32 md:w-44",
    rotate: -8,
    from: { x: -60, y: 40 },
    delay: 0.6,
    drift: { x: 4, y: -8, rotate: -7, dur: 6.4 },
    picked: true,
    pickDelay: 2.8
  },
  {
    src: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=420&h=420&fit=crop&q=70",
    cls: "top-[2%] right-[8%] w-36 md:w-48",
    rotate: 6,
    from: { x: 70, y: 50 },
    delay: 0.75,
    drift: { x: -5, y: -6, rotate: 7.6, dur: 5.6 }
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=420&h=560&fit=crop&q=70",
    cls: "top-[42%] left-[1%] w-28 md:w-40 hidden sm:block",
    rotate: -3,
    from: { x: -80, y: 30 },
    delay: 0.9,
    drift: { x: 6, y: 8, rotate: -2, dur: 4.8 }
  },
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=420&h=520&fit=crop&q=70",
    cls: "top-[40%] right-[2%] w-32 md:w-44 hidden sm:block",
    rotate: 9,
    from: { x: 80, y: 40 },
    delay: 1.05,
    drift: { x: -4, y: -10, rotate: 11, dur: 5.2 },
    picked: true,
    pickDelay: 3.05
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=420&h=420&fit=crop&q=70",
    cls: "bottom-[6%] left-[18%] w-28 md:w-36 hidden md:block",
    rotate: -5,
    from: { x: -40, y: 80 },
    delay: 1.2,
    drift: { x: 5, y: 7, rotate: -3.5, dur: 4.4 }
  },
  {
    src: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=420&h=480&fit=crop&q=70",
    cls: "bottom-[8%] right-[20%] w-28 md:w-40 hidden md:block",
    rotate: 4,
    from: { x: 40, y: 80 },
    delay: 1.35,
    drift: { x: -6, y: 6, rotate: 6, dur: 5.8 },
    picked: true,
    pickDelay: 3.3
  }
];

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.9 + i * 0.12, duration: 0.9, ease }
  })
};

export function HeroSection() {
  return (
    <>
      {/* ─────── NAV ─────── */}
      <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Picka." className="h-7 w-auto" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="flex items-center gap-8 text-[11px] uppercase tracking-[0.3em]"
        >
          <a href="#how" className="hidden text-mute transition hover:text-ink sm:inline">How it works</a>
          <a href="#why" className="hidden text-mute transition hover:text-ink sm:inline">Why Picka</a>
          <Link href="/admin" className="text-ink">Sign in</Link>
        </motion.div>
      </nav>

      {/* ─────── HERO ─────── */}
      <section className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center justify-center px-6 py-16 md:px-10 md:py-24">
        {/* Floating photo cards */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              className={`absolute ${c.cls}`}
              initial={{
                opacity: 0,
                x: c.from.x,
                y: c.from.y,
                rotate: c.rotate,
                scale: 0.96,
                filter: "blur(8px)"
              }}
              animate={{
                opacity: [0, 1, 1],
                x: [c.from.x, 0, c.drift.x, 0],
                y: [c.from.y, 0, c.drift.y, 0],
                rotate: [c.rotate, c.rotate, c.drift.rotate, c.rotate],
                scale: [0.96, 1, 1, 1],
                filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)"]
              }}
              transition={{
                duration: c.drift.dur + 2.4,
                times: [0, 0.28, 0.64, 1],
                delay: c.delay,
                ease,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0
              }}
            >
              <div className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.28)] ring-1 ring-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt="" className="block aspect-[4/5] w-full object-cover" />
              </div>

              {c.picked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: [0.4, 1.2, 1] }}
                  transition={{ delay: c.pickDelay, duration: 0.7, ease }}
                  className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper shadow-lg ring-2 ring-paper"
                  aria-hidden
                >
                  <StarIcon />
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* floating "24 picked" badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: [16, 0, -4, 0], scale: 1 }}
            transition={{
              opacity: { delay: 3.5, duration: 0.8, ease },
              scale:   { delay: 3.5, duration: 0.8, ease },
              y:       { delay: 3.5, duration: 5, ease, repeat: Infinity, repeatType: "reverse" }
            }}
            className="absolute bottom-[18%] left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-ink/10 bg-paper/90 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-ink shadow-lg backdrop-blur md:flex"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <strong className="font-semibold tabular-nums">24</strong>
            <span className="text-mute">picked</span>
          </motion.div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease }}
            className="text-[11px] uppercase tracking-[0.4em] text-mute"
          >
            The modern home for sharing photography
          </motion.p>

          <h1 className="mt-6 font-serif text-[clamp(3.25rem,10vw,8.5rem)] italic leading-[0.92] tracking-tightest">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word + i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={wordVariants}
                className={`mr-[0.18em] inline-block ${i >= 2 ? "text-mute" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.85, duration: 1.0, ease }}
            className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-ink/70 md:text-lg"
          >
            Upload a gallery, send one link, and let clients pick their favorites
            without the back-and-forth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.9, ease }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/admin" className="btn btn-primary">
              Start a shoot
            </Link>
            <a href="#how" className="btn btn-ghost">
              See the process
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.7l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

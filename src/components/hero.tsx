"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type MotionValue
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Card = {
  src: string;
  cls: string; // position + width
  rotate: number;
  depth: number; // parallax intensity
  blur: number;
  opacity: number;
  floatDur: number;
};

const CARDS: Card[] = [
  {
    src: "/hero/photo-1.jpg",
    cls: "top-[6%] left-[4%] w-32 md:w-44",
    rotate: -8, depth: 32, blur: 0, opacity: 1, floatDur: 7
  },
  {
    src: "/hero/photo-3.jpg",
    cls: "top-[4%] right-[6%] w-36 md:w-48",
    rotate: 6, depth: 26, blur: 0, opacity: 1, floatDur: 8
  },
  {
    src: "/hero/photo-2.jpg",
    cls: "top-[34%] left-[1%] w-24 md:w-36",
    rotate: -3, depth: 18, blur: 2, opacity: 0.92, floatDur: 9
  },
  {
    src: "/hero/photo-4.jpg",
    cls: "top-[36%] right-[2%] w-28 md:w-40",
    rotate: 4, depth: 22, blur: 0, opacity: 1, floatDur: 7.5
  },
  {
    src: "/hero/photo-3.jpg",
    cls: "bottom-[6%] left-[14%] w-28 md:w-36",
    rotate: 7, depth: 24, blur: 1, opacity: 0.95, floatDur: 8.5
  },
  {
    src: "/hero/photo-5.jpg",
    cls: "bottom-[8%] right-[16%] w-28 md:w-40",
    rotate: -5, depth: 28, blur: 0, opacity: 1, floatDur: 6.5
  },
  {
    src: "/hero/photo-4.jpg",
    cls: "top-[20%] left-[38%] w-20 md:w-28",
    rotate: 9, depth: 14, blur: 4, opacity: 0.5, floatDur: 10
  },
  {
    src: "/hero/photo-2.jpg",
    cls: "bottom-[24%] right-[38%] w-20 md:w-28",
    rotate: -7, depth: 16, blur: 3, opacity: 0.55, floatDur: 9.5
  }
];

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [phase, setPhase] = useState<"prelude" | "brand">("prelude");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / window.innerWidth);
      mouseY.set((e.clientY - window.innerHeight / 2) / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const t = setTimeout(() => setPhase("brand"), 3400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: "#FAFAF7" }}
    >
      <Nav />

      {/* Floating cards */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {CARDS.map((c, i) => (
          <FloatingCard key={i} card={c} index={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Centre text */}
      <div className="relative z-20 px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === "prelude" ? (
            <motion.div
              key="prelude"
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(10px)" }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <h2
                className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] font-light leading-none tracking-tight"
                style={{ color: "#111111" }}
              >
                <span className="font-light">inspired by</span>{" "}
                <em className="italic font-normal">photographers</em>
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="brand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col items-center"
            >
              {/* PICKA wordmark */}
              <motion.img
                src="/logo.png"
                alt="PICKA."
                initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
                className="h-16 w-auto md:h-24"
              />

              <motion.p
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.0, delay: 1.1, ease: EASE }}
                className="mt-10 text-[11px] uppercase tracking-[0.4em]"
                style={{ color: "#666666" }}
              >
                A better way to share photos
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.0, delay: 1.8, ease: EASE }}
                className="mt-5 font-serif text-2xl italic md:text-3xl"
                style={{ color: "#111111" }}
              >
                Share photos, not files.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 2.6, ease: EASE }}
                className="mt-12"
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-3 rounded-full bg-clay px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-paper shadow-[0_20px_60px_-20px_rgba(184,91,63,0.4)] transition-all duration-300 hover:scale-[1.04] hover:bg-clay-soft"
                >
                  Create Gallery <span aria-hidden>→</span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
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
        transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
        className="flex items-center gap-2"
      >
        <Link
          href="/admin/login"
          className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-ink/70 transition-colors hover:text-ink"
        >
          Log in
        </Link>
        <Link
          href="/admin/login"
          className="rounded-full bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-paper transition-all hover:bg-clay"
        >
          Sign up
        </Link>
      </motion.div>
    </nav>
  );
}

function FloatingCard({
  card,
  index,
  mouseX,
  mouseY
}: {
  card: Card;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const px = useTransform(mouseX, [-1, 1], [-card.depth, card.depth]);
  const py = useTransform(mouseY, [-1, 1], [-card.depth, card.depth]);

  return (
    <motion.div
      style={{ x: px, y: py }}
      className={`absolute ${card.cls}`}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
      animate={{
        opacity: card.opacity,
        scale: 1,
        filter: `blur(${card.blur}px)`
      }}
      transition={{ duration: 1.8, delay: 0.15 + index * 0.12, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -10, 0, 8, 0] }}
        transition={{
          duration: card.floatDur,
          delay: index * 0.4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ rotate: card.rotate }}
      >
        <div className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(14,14,16,0.25)] ring-1 ring-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.src} alt="" className="block aspect-[4/5] w-full object-cover" />
        </div>
      </motion.div>
    </motion.div>
  );
}

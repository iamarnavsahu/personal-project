"use client";

import { motion } from "framer-motion";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=300&fit=crop&q=70", picked: true },
  { src: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=240&h=300&fit=crop&q=70", picked: false },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=240&h=300&fit=crop&q=70", picked: true },
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=240&h=300&fit=crop&q=70", picked: false },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=70", picked: true },
  { src: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=240&h=300&fit=crop&q=70", picked: false },
  { src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=300&fit=crop&q=70", picked: true },
  { src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=240&h=300&fit=crop&q=70", picked: false }
];

export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-[280px] sm:w-[320px] md:w-[340px]"
    >
      {/* Phone frame */}
      <div className="relative rounded-[2.75rem] bg-ink p-2 shadow-[0_50px_100px_-20px_rgba(14,14,16,0.45)] ring-1 ring-ink/20">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-paper">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[9px] font-medium text-ink/80">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>●●●●</span>
              <span className="ml-1 inline-block h-1.5 w-3 rounded-sm bg-ink/80" />
            </div>
          </div>

          {/* App header */}
          <div className="border-b border-ink/10 px-5 pb-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Picka." className="h-3 w-auto" />
                <h3 className="mt-1 text-sm font-bold leading-tight">Sarah&rsquo;s Grad</h3>
                <p className="text-[9px] text-ink/55">for Sarah Chen</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-clay/30 bg-clay/[0.08] px-2 py-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5 text-clay">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                </svg>
                <span className="text-[9px] font-semibold tabular-nums text-clay">4</span>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-1 p-1.5">
            {PHOTOS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-square overflow-hidden rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="block h-full w-full object-cover" />
                {p.picked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ delay: 0.9 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-paper shadow"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Submit bar */}
          <div className="border-t border-ink/10 p-3">
            <div className="rounded-full bg-ink py-2 text-center text-[10px] font-medium uppercase tracking-widest text-paper">
              Send my picks →
            </div>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />
      </div>
    </motion.div>
  );
}

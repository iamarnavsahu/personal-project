"use client";

import { useEffect, useState } from "react";
import { HeroAnimation } from "@/components/hero-animation";

export function UnlockIntro({
  galleryId,
  title,
  clientName
}: {
  galleryId: string;
  title: string;
  clientName: string | null;
}) {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const key = `picka_intro_${galleryId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    setShow(true);

    const fadeT = setTimeout(() => setFadeOut(true), 4200);
    const doneT = setTimeout(() => setShow(false), 5000);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(doneT);
    };
  }, [galleryId]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="w-full max-w-xl px-6">
        <HeroAnimation />
      </div>
      <div className="mt-6 px-6 text-center fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-mute">Welcome</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tightest md:text-4xl">{title}</h2>
        {clientName && <p className="mt-1 text-ink/60">for {clientName}</p>}
      </div>
    </div>
  );
}

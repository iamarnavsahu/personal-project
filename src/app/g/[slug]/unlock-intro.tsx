"use client";

import { useEffect, useRef, useState } from "react";
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
  const [textIn, setTextIn] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const key = `picka_intro_${galleryId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    setShow(true);
    const textT = setTimeout(() => setTextIn(true), 800);
    const fadeT = setTimeout(() => setFadeOut(true), 4200);
    const doneT = setTimeout(() => setShow(false), 5000);
    return () => {
      clearTimeout(textT);
      clearTimeout(fadeT);
      clearTimeout(doneT);
    };
  }, [galleryId]);

  if (!show) return null;

  const name = clientName?.trim() || title;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-paper transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center">
        <div className="w-full max-w-md">
          <HeroAnimation />
        </div>

        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            textIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.32em] text-mute">
            Welcome to your gallery,
          </p>
          <h2 className="mt-3 text-5xl font-bold leading-none tracking-tightest md:text-6xl">
            {name}
          </h2>
        </div>
      </div>
    </div>
  );
}

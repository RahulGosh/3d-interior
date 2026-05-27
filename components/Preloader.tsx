"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleProgress = (e: CustomEvent<{ percent: number }>) => {
      setProgress(e.detail.percent);
      if (e.detail.percent >= 100) setIsLoaded(true);
    };

    window.addEventListener("hero-progress", handleProgress as EventListener);
    const fallback = setTimeout(() => setIsLoaded(true), 6000);

    return () => {
      window.removeEventListener("hero-progress", handleProgress as EventListener);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && textRef.current) {
      const tl = gsap.timeline();
      tl.to(textRef.current, { opacity: 0, y: -24, duration: 0.6, ease: "power2.inOut" }, 0.2)
        .to(containerRef.current, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, 0.5);
    }
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none"
      style={{ background: "#17130F" }}
    >
      <div ref={textRef} className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-px h-8 bg-[var(--champagne)] opacity-60" />
          <span
            className="font-display text-[var(--champagne)] tracking-[0.5em] text-xl font-light"
            style={{ letterSpacing: "0.45em" }}
          >
            AUREON
          </span>
          <div className="w-px h-8 bg-[var(--champagne)] opacity-60" />
        </div>

        <p className="font-editorial italic text-[var(--muted-ink)] text-base tracking-wide">
          Summoning worlds&hellip;
        </p>

        {/* Progress bar */}
        <div className="w-56 h-[1px] bg-white/10 relative overflow-hidden mt-2">
          <div
            ref={barFillRef}
            className="absolute inset-y-0 left-0 bg-[var(--champagne)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[var(--stone)] text-xs tracking-[0.25em] font-mono tabular-nums">
          {String(progress).padStart(3, "0")}%
        </span>
      </div>
    </div>
  );
}

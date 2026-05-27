"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const TOTAL_FRAMES = 192;
const FRAME_PATH = "/hero-frames/frame_";
const FRAME_EXT = ".png";

const pad = (n: number) => String(n).padStart(6, "0");
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}${FRAME_EXT}`;

const COPY_SEQUENCE = [
  { text: "AUREON", type: "title" as const, start: 0, end: 15 },
  { text: "Some structures are built.", type: "line" as const, start: 12, end: 26 },
  { text: "Others are summoned.", type: "line" as const, start: 23, end: 36 },
  { text: "Private worlds.", type: "accent" as const, start: 33, end: 46 },
  { text: "Suspended beyond expectation.", type: "line" as const, start: 43, end: 58 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudForeRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrame = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);

    let loadedCount = 0;
    let cancelled = false;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(pct);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: pct } }));
          if (index === currentFrame.current) drawFrame(index);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });

    const preload = async () => {
      await loadImage(0);
      drawFrame(0);
      if (cancelled) return;
      const step8 = Array.from({ length: Math.ceil(TOTAL_FRAMES / 8) }, (_, k) => k * 8);
      await Promise.all(step8.map(loadImage));
      if (cancelled) return;
      const step4 = Array.from({ length: Math.ceil(TOTAL_FRAMES / 4) }, (_, k) => k * 4);
      await Promise.all(step4.map(loadImage));
      if (cancelled) return;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (cancelled) return;
        await loadImage(i);
      }
    };

    preload();
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  /* Scroll animation */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
      /* Frame scrub */
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const targetIndex = Math.min(
            Math.floor(self.progress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          let bestIndex = targetIndex;
          if (!images.current[targetIndex]) {
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
              const lo = targetIndex - offset;
              const hi = targetIndex + offset;
              if (lo >= 0 && images.current[lo]) { bestIndex = lo; break; }
              if (hi < TOTAL_FRAMES && images.current[hi]) { bestIndex = hi; break; }
            }
          }
          if (bestIndex !== currentFrame.current) {
            currentFrame.current = bestIndex;
            drawFrame(bestIndex);
          }
        },
      });

      /* Golden bloom */
      if (bloomRef.current) {
        gsap.fromTo(bloomRef.current,
          { opacity: 0.05 },
          { opacity: 0.45, ease: "none", scrollTrigger: { trigger: wrapper, start: "top top", end: "55% bottom", scrub: 1 } }
        );
      }

      /* Cloud sweep 55%–95% */
      if (cloudBackRef.current && cloudMidRef.current && cloudForeRef.current && fogRef.current) {
        const cloudTl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: "55% top", end: "95% top", scrub: true },
        });
        cloudTl
          .fromTo(cloudBackRef.current, { y: "100vh", opacity: 0 }, { y: "-150vh", opacity: 0.9, duration: 1.5, ease: "none" }, 0)
          .fromTo(cloudMidRef.current, { y: "110vh", opacity: 0 }, { y: "-180vh", opacity: 1, duration: 1.5, ease: "none" }, 0.2)
          .fromTo(cloudForeRef.current, { y: "120vh", opacity: 0 }, { y: "-220vh", opacity: 1, duration: 1.5, ease: "none" }, 0.4)
          .fromTo(fogRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.in" }, 0.85);
      }

      /* Final text 75%–95% */
      if (finalTextRef.current) {
        gsap.fromTo(finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, ease: "power3.out",
            scrollTrigger: { trigger: wrapper, start: "75% top", end: "95% top", scrub: true } }
        );
      }

      /* Copy sequence */
      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end } = COPY_SEQUENCE[i];
        const rotations = [
          { rotationX: 10, rotationY: -5 },
          { rotationX: -5, rotationY: 5 },
          { rotationX: 5, rotationY: -10 },
          { rotationX: 0, rotationY: 10 },
          { rotationX: -10, rotationY: 0 },
        ];
        const rot = rotations[i % rotations.length];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: `${start}% top`, end: `${end}% top`, scrub: 1 },
        });
        if (i === 4) {
          tl.fromTo(el, { opacity: 0, z: -1000, x: "20vw", scale: 0.8, ...rot },
            { opacity: 1, z: 0, x: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" })
            .to(el, { opacity: 0, z: 800, x: "-100vw", scale: 1.5, rotationY: -30, duration: 0.6, ease: "power2.in" });
        } else {
          tl.fromTo(el, { opacity: 0, z: -1500, scale: 0.6, ...rot },
            { opacity: 1, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" })
            .to(el, { opacity: 0, z: 1500, scale: 2.5, duration: 0.6, ease: "power2.in" });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  /* Page load entrance */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 2.2 });
    if (overlayRef.current) tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    if (copyRefs.current[0]) {
      tl.fromTo(copyRefs.current[0], { opacity: 0, y: 60, scale: 0.88 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }, 0.2);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      aria-label="Hero — Scroll to explore"
    >
      {/* Frame canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Cinematic vignette */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg,rgba(23,19,15,0.3) 0%,rgba(23,19,15,0) 30%,rgba(23,19,15,0) 60%,rgba(23,19,15,0.45) 100%),
            linear-gradient(90deg,rgba(23,19,15,0.2) 0%,transparent 25%,transparent 75%,rgba(23,19,15,0.2) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Golden bloom */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: "radial-gradient(ellipse 65% 45% at 50% 25%,rgba(200,169,106,0.18) 0%,transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Fog layer */}
      <div
        ref={fogRef}
        className="absolute inset-0 pointer-events-none z-[4] opacity-0"
        style={{ background: "#e8e5df" }}
        aria-hidden="true"
      />

      {/* Clouds — screen blend */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-visible" style={{ mixBlendMode: "screen" }}>
        <div ref={cloudBackRef} className="absolute inset-0" style={{ filter: "blur(12px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover opacity-80" />
        </div>
        <div ref={cloudMidRef} className="absolute inset-0" style={{ filter: "blur(6px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover opacity-90" style={{ transform: "scaleX(-1)" }} />
        </div>
        <div ref={cloudForeRef} className="absolute inset-0" style={{ filter: "blur(2px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover" style={{ transform: "scale(1.2)" }} />
        </div>
      </div>

      {/* 3D copy container */}
      <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none" style={{ perspective: "1200px" }}>
        {COPY_SEQUENCE.map((item, i) => (
          <div
            key={i}
            ref={(el) => { copyRefs.current[i] = el; }}
            className="absolute w-full flex items-center justify-center px-8 will-change-transform"
            style={{ opacity: 0 }}
          >
            {item.type === "title" ? (
              <h1 className="text-hero text-white text-center drop-shadow-2xl" style={{ textShadow: "0 0 80px rgba(200,169,106,0.4)" }}>
                {item.text}
              </h1>
            ) : item.type === "accent" ? (
              <p className="font-editorial italic text-[var(--champagne)] text-center drop-shadow-lg"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)", textShadow: "0 0 40px rgba(200,169,106,0.6)" }}>
                {item.text}
              </p>
            ) : (
              <p className="font-display font-light text-white/90 text-center tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}>
                {item.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Final editorial text */}
      <div
        ref={finalTextRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[7] opacity-0 pointer-events-none text-center px-8 w-full max-w-2xl"
      >
        <p className="font-editorial italic text-[var(--ink)] text-xl md:text-3xl leading-relaxed mb-6">
          "Architecture is not about space — it is about time."
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[var(--champagne)]" />
          <span className="text-section-label text-[var(--muted-ink)]">Scroll to discover</span>
          <div className="h-px w-12 bg-[var(--champagne)]" />
        </div>
      </div>

      {/* Scroll hint arrow (only at page top) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center gap-2 animate-float pointer-events-none">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/50" />
      </div>

      {/* Load progress debug (hidden in production) */}
      {process.env.NODE_ENV === "development" && loadProgress < 100 && (
        <div className="absolute top-4 right-4 z-[9] text-white/40 text-xs font-mono">
          Frames: {loadProgress}%
        </div>
      )}
    </section>
  );
}

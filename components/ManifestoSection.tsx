"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const WORDS = [
  "We", "do", "not", "design", "buildings.",
  "We", "compose", "experiences", "that", "outlast", "their", "architects.",
  "Every", "line", "drawn", "is", "a", "decision",
  "about", "how", "light", "should", "fall",
  "and", "how", "silence", "should", "feel.",
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* Pin the section and scrub words in */
      const validWords = wordsRef.current.filter(Boolean);

      gsap.fromTo(validWords,
        { opacity: 0.08, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-40 px-8 md:px-16 lg:px-24 bg-[var(--background)]"
      aria-label="Manifesto"
    >
      {/* Section label */}
      <div className="flex items-center gap-4 mb-16">
        <div className="h-px w-8 bg-[var(--champagne)]" />
        <span className="text-section-label">Our Manifesto</span>
      </div>

      <p className="text-manifesto text-[var(--ink)] max-w-5xl leading-[0.92] tracking-tight">
        {WORDS.map((word, i) => (
          <span key={i} className="inline-block mr-[0.22em]">
            <span
              ref={(el) => { wordsRef.current[i] = el; }}
              className="inline-block will-change-transform"
              style={{ opacity: 0.08 }}
            >
              {word}
            </span>
          </span>
        ))}
      </p>

      {/* Decorative accent */}
      <div className="mt-24 flex items-end justify-between flex-wrap gap-8">
        <div className="max-w-md">
          <p className="font-editorial italic text-[var(--muted-ink)] text-lg leading-relaxed">
            Founded in silence. Built in precision.<br />
            Delivered to those who require neither explanation nor compromise.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-display text-7xl font-bold text-[var(--stone)] leading-none tracking-tight opacity-30">
            2012
          </span>
          <span className="text-section-label">Est.</span>
        </div>
      </div>
    </section>
  );
}

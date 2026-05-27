"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const PROJECTS = [
  {
    id: "villa-meridian",
    index: "01",
    title: "Villa Meridian",
    subtitle: "Southern Coast, Portugal",
    category: "Private Residence",
    area: "2,400 m²",
    year: "2023",
    description: "A folded concrete landscape that disappears into the cliff. Seven interior gardens, one infinity pool dissolving into the Atlantic.",
    image: "/images/ChatGPT Image May 26, 2026, 11_09_36 PM.png",
  },
  {
    id: "tower-obsidian",
    index: "02",
    title: "Obsidian Tower",
    subtitle: "Dubai, UAE",
    category: "Residential Tower",
    area: "84,000 m²",
    year: "2024",
    description: "A 320-metre column of black glass and bronze. Each floor unique. Rooftop observatory suspended above the clouds.",
    image: "/images/ChatGPT Image May 26, 2026, 11_11_18 PM.png",
  },
  {
    id: "estate-valcourt",
    index: "03",
    title: "Estate Valcourt",
    subtitle: "Côte d'Azur, France",
    category: "Private Estate",
    area: "5,800 m²",
    year: "2024",
    description: "Twelve hectares of Provençal landscape reshaped around a single family's rituals. Stone, water, and olive groves in dialogue.",
    image: "/images/ChatGPT Image May 26, 2026, 11_13_16 PM.png",
  },
];

export default function AnthologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      /* Card entrance animations */
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 40%",
              scrub: false,
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anthology"
      className="relative bg-[var(--ink)] py-32 overflow-hidden"
      aria-label="Project Anthology"
    >
      {/* Heading */}
      <div className="px-8 md:px-16 lg:px-24 mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-8 bg-[var(--champagne)]" />
          <span className="text-section-label text-[var(--stone)]">Selected Works</span>
        </div>
        <h2
          className="font-display font-bold text-[var(--surface)] leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.05em" }}
        >
          The<br />
          <span className="font-editorial italic text-[var(--champagne)]">Anthology</span>
        </h2>
      </div>

      {/* Projects grid */}
      <div
        ref={trackRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.05)] px-0"
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="group relative overflow-hidden cursor-pointer bg-[var(--ink)]"
            style={{ opacity: 0 }}
          >
            {/* Image */}
            <div className="relative overflow-hidden h-[55vh] md:h-[70vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent opacity-70" />
              {/* Hover reveal overlay */}
              <div className="absolute inset-0 bg-[var(--champagne)] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
            </div>

            {/* Content */}
            <div className="p-8 border-t border-white/5">
              <div className="flex items-start justify-between mb-4">
                <span className="font-display text-[var(--muted-ink)] text-xs tracking-[0.2em] uppercase">
                  {project.index}
                </span>
                <span className="text-section-label text-[var(--muted-ink)]">{project.year}</span>
              </div>
              <h3 className="font-display font-semibold text-[var(--surface)] text-2xl tracking-tight mb-1">
                {project.title}
              </h3>
              <p className="text-[var(--stone)] text-sm mb-4">{project.subtitle}</p>
              <p className="text-[var(--muted-ink)] text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-24 overflow-hidden" style={{ transitionProperty: "opacity, max-height" }}>
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-section-label text-[var(--muted-ink)]">{project.category}</span>
                <span className="text-[var(--stone)] text-xs">{project.area}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="px-8 md:px-16 lg:px-24 mt-20 flex items-center justify-between flex-wrap gap-6">
        <p className="font-editorial italic text-[var(--muted-ink)] text-lg">
          Forty-three completed commissions across sixteen countries.
        </p>
        <button className="group flex items-center gap-3 text-[var(--champagne)] text-sm uppercase tracking-[0.15em] font-medium hover:gap-5 transition-all duration-300">
          <span>View all works</span>
          <div className="w-8 h-px bg-[var(--champagne)] group-hover:w-12 transition-all duration-300" />
        </button>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const AMENITIES = [
  {
    id: "spa",
    number: "01",
    title: "Private Thermal Spa",
    subtitle: "Basalt & mineral water, bespoke rituals",
    description:
      "Carved from black basalt into the bedrock itself. Hot springs sourced from a private geothermal well. Three treatment rooms, a hammam, and a plunge pool fed by mountain glaciers.",
    stat: "1,200 m²",
    statLabel: "Treatment area",
  },
  {
    id: "vault",
    number: "02",
    title: "Climate-Controlled Art Vault",
    subtitle: "Museum-grade preservation",
    description:
      "Humidity, temperature, and UV controlled to museum specification. Biometric access. Space for forty major works. Curated with leading conservation advisors.",
    stat: "±0.5°C",
    statLabel: "Temperature precision",
  },
  {
    id: "pool",
    number: "03",
    title: "Infinity Horizon Pool",
    subtitle: "Zero-edge, sky-dissolving",
    description:
      "The edge disappears. Water and horizon become indistinguishable. Heated to within a degree of your preference. Midnight swim lighting designed by theatre illuminators.",
    stat: "42 m",
    statLabel: "Pool length",
  },
];

export default function SignatureAmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* Animate content swap */
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  const active = AMENITIES[activeIndex];

  /* Pastel background tones per amenity */
  const bgColors = [
    "linear-gradient(135deg,#1a1410 0%,#2a1f15 100%)",
    "linear-gradient(135deg,#111318 0%,#1a1f2a 100%)",
    "linear-gradient(135deg,#101518 0%,#161e22 100%)",
  ];

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative bg-[var(--surface)] py-40 overflow-hidden"
      aria-label="Signature Amenities"
    >
      <div className="px-8 md:px-16 lg:px-24">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[var(--champagne)]" />
          <span className="text-section-label">Signature Amenities</span>
        </div>
        <h2
          className="font-display font-bold text-[var(--ink)] mb-20 leading-none tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.05em" }}
        >
          Beyond<br />
          <span className="font-editorial italic text-[var(--bronze)]">expectation</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left: accordion list */}
          <div className="lg:col-span-2 space-y-1">
            {AMENITIES.map((amenity, i) => (
              <div
                key={amenity.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="group cursor-pointer"
                style={{ opacity: 0 }}
                onClick={() => setActiveIndex(i)}
              >
                <div
                  className={`flex items-start gap-6 py-6 border-b transition-colors duration-300 ${
                    activeIndex === i
                      ? "border-[var(--champagne)]"
                      : "border-[var(--stone)]/30 hover:border-[var(--stone)]"
                  }`}
                >
                  <span
                    className={`text-xs tracking-[0.2em] font-display pt-1 transition-colors duration-300 ${
                      activeIndex === i ? "text-[var(--champagne)]" : "text-[var(--stone)]"
                    }`}
                  >
                    {amenity.number}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`font-display font-semibold text-lg tracking-tight mb-1 transition-colors duration-300 ${
                        activeIndex === i ? "text-[var(--ink)]" : "text-[var(--muted-ink)] group-hover:text-[var(--ink)]"
                      }`}
                    >
                      {amenity.title}
                    </h3>
                    <p className="text-[var(--muted-ink)] text-sm">{amenity.subtitle}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${
                      activeIndex === i
                        ? "border-[var(--champagne)] bg-[var(--champagne)]"
                        : "border-[var(--stone)] group-hover:border-[var(--champagne)]"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        activeIndex === i ? "bg-white" : "bg-transparent"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3">
            {/* Visualization box */}
            <div
              ref={imageRef}
              className="relative rounded-2xl overflow-hidden mb-8"
              style={{ height: "50vh", background: bgColors[activeIndex], transition: "background 0.8s ease" }}
            >
              {/* Architectural decorative overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 opacity-20">
                  {[0, 1, 2].map((ring) => (
                    <div
                      key={ring}
                      className="absolute inset-0 rounded-full border border-[var(--champagne)]"
                      style={{
                        transform: `scale(${0.5 + ring * 0.25})`,
                        animationDelay: `${ring * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Stat */}
              <div className="absolute bottom-6 left-6">
                <p className="font-display font-bold text-[var(--champagne)] leading-none mb-1"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  {active.stat}
                </p>
                <p className="text-section-label text-[var(--stone)]">{active.statLabel}</p>
              </div>
              {/* Number */}
              <div className="absolute top-6 right-8">
                <span className="font-display font-bold text-white/5 leading-none select-none"
                  style={{ fontSize: "6rem" }}>
                  {active.number}
                </span>
              </div>
            </div>

            {/* Content */}
            <div ref={contentRef}>
              <h3 className="font-display font-semibold text-[var(--ink)] text-2xl tracking-tight mb-4">
                {active.title}
              </h3>
              <p className="text-[var(--muted-ink)] leading-relaxed text-base mb-6">
                {active.description}
              </p>
              <button className="group flex items-center gap-3 text-[var(--bronze)] text-sm uppercase tracking-[0.15em] font-medium">
                <span>Enquire about this amenity</span>
                <div className="w-6 h-px bg-[var(--bronze)] group-hover:w-10 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

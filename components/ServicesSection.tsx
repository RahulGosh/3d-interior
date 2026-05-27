"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const SERVICES = [
  {
    id: "acquire",
    label: "Acquire",
    tagline: "Find what does not yet exist",
    description:
      "We identify properties before they reach the market. Off-record estates, unreleased towers, private portfolios. If you can imagine it, we will locate it — often in countries you have not yet considered.",
    features: ["Off-market access", "Global portfolio sourcing", "Due diligence & legal", "Acquisition structuring"],
    image: "/images/ChatGPT Image May 26, 2026, 11_09_36 PM.png",
    accent: "#C8A96A",
  },
  {
    id: "design",
    label: "Design & Build",
    tagline: "Commission the impossible",
    description:
      "From concept to key — a single point of accountability. Our architects, engineers, and master craftsmen work under one roof to deliver structures that have never existed before.",
    features: ["Architectural design", "Interior specification", "Construction management", "Landscape & grounds"],
    image: "/images/ChatGPT Image May 26, 2026, 11_11_18 PM.png",
    accent: "#8A6A3E",
  },
  {
    id: "manage",
    label: "Estate Management",
    tagline: "A world that runs itself",
    description:
      "Staffed, maintained, and managed to five-star standards year-round. Whether you visit once a year or quarterly, every surface is as you left it. Every system is silent.",
    features: ["Full-time estate staff", "Preventive maintenance", "Security systems", "Concierge services"],
    image: "/images/ChatGPT Image May 26, 2026, 11_13_16 PM.png",
    accent: "#D8C3A5",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(section.querySelectorAll(".service-row"),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const displayIndex = hoveredService !== null ? hoveredService : activeService;
  const service = SERVICES[displayIndex];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-[var(--background)] py-40 overflow-hidden"
      aria-label="Services"
    >
      <div className="px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[var(--champagne)]" />
          <span className="text-section-label">What We Do</span>
        </div>
        <div className="flex items-end justify-between mb-20 flex-wrap gap-8">
          <h2
            className="font-display font-bold text-[var(--ink)] leading-none tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.05em" }}
          >
            Three ways<br />
            <span className="font-editorial italic text-[var(--bronze)]">to engage</span>
          </h2>
          <p className="text-[var(--muted-ink)] max-w-xs text-sm leading-relaxed">
            Each engagement begins with a private consultation. No templates. No precedent. Only your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left: Service accordion */}
          <div className="lg:col-span-3 space-y-0">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.id}
                className="service-row group cursor-pointer"
                style={{ opacity: 0 }}
                onClick={() => setActiveService(i)}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div
                  className={`flex items-center justify-between py-8 border-b transition-all duration-500 ${
                    displayIndex === i
                      ? "border-[var(--champagne)]"
                      : "border-[var(--stone)]/30 hover:border-[var(--stone)]/60"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <span className="text-xs tracking-[0.2em] font-display text-[var(--stone)] w-6">
                      0{i + 1}
                    </span>
                    <div>
                      <h3
                        className={`font-display font-semibold text-2xl md:text-3xl tracking-tight transition-colors duration-300 ${
                          displayIndex === i ? "text-[var(--ink)]" : "text-[var(--muted-ink)] group-hover:text-[var(--ink)]"
                        }`}
                      >
                        {svc.label}
                      </h3>
                      <p
                        className={`font-editorial italic text-base mt-1 transition-all duration-500 ${
                          displayIndex === i ? "opacity-100 text-[var(--bronze)]" : "opacity-0 h-0 overflow-hidden"
                        }`}
                      >
                        {svc.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      displayIndex === i
                        ? "border-[var(--champagne)] bg-[var(--champagne)] text-white"
                        : "border-[var(--stone)]/40 text-[var(--muted-ink)] group-hover:border-[var(--champagne)] group-hover:text-[var(--champagne)]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d={displayIndex === i ? "M3 7H11M11 7L7 3M11 7L7 11" : "M7 3V11M3 7H11"}
                        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded features */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    displayIndex === i ? "max-h-48 py-6" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-wrap gap-3 pl-14">
                    {svc.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border border-[var(--stone)]/30 text-[var(--muted-ink)]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Image panel */}
          <div className="lg:col-span-2 sticky top-24">
            <div
              ref={imageRef}
              className="relative rounded-2xl overflow-hidden"
              style={{ height: "55vh" }}
            >
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: displayIndex === i ? 1 : 0 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.image}
                    alt={svc.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-transparent to-transparent" />
                </div>
              ))}
              {/* Label overlay */}
              <div ref={detailRef} className="absolute bottom-6 left-6 right-6">
                <p className="font-editorial italic text-white/80 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

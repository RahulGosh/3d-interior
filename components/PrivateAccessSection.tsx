"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

export default function PrivateAccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const posRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.08;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.08;

      const x = posRef.current.x * 100;
      const y = posRef.current.y * 100;

      spotlight.style.background = `
        radial-gradient(ellipse 300px 300px at ${x}% ${y}%,
          rgba(200,169,106,0.15) 0%,
          rgba(200,169,106,0.04) 40%,
          transparent 70%
        )
      `;

      rafRef.current = requestAnimationFrame(tick);
    };

    section.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(textRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="private-access"
      className="relative bg-[var(--ink)] py-48 overflow-hidden cursor-none"
      aria-label="Private Access"
    >
      {/* Spotlight layer */}
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true" />

      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 40px,
            rgba(200,169,106,1) 40px, rgba(200,169,106,1) 41px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 40px,
            rgba(200,169,106,1) 40px, rgba(200,169,106,1) 41px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-[2] px-8 md:px-16 lg:px-24 flex flex-col items-center text-center">
        <div ref={textRef} className="max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 bg-[var(--champagne)] opacity-40" />
            <span className="text-section-label text-[var(--stone)]">By Invitation Only</span>
            <div className="h-px w-12 bg-[var(--champagne)] opacity-40" />
          </div>

          <h2
            className="font-display font-bold text-[var(--surface)] leading-none tracking-tight mb-10"
            style={{ fontSize: "clamp(3rem, 7vw, 8rem)", letterSpacing: "-0.06em" }}
          >
            Private<br />
            <span className="font-editorial italic text-[var(--champagne)]">access</span>
          </h2>

          <p className="text-[var(--muted-ink)] text-lg leading-relaxed max-w-2xl mx-auto mb-16">
            AUREON does not have a waiting list. We have a conversation.
            If you have arrived here, you are already being considered.
            The next step is yours.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 border-t border-white/8 pt-12 mb-16">
            {[
              { value: "43", label: "Completed worlds" },
              { value: "16", label: "Countries" },
              { value: "100%", label: "Client retention" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <span
                  className="font-display font-bold text-[var(--champagne)] leading-none"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
                >
                  {stat.value}
                </span>
                <span className="text-section-label text-[var(--stone)]">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="font-editorial italic text-[var(--stone)] text-base">
            Move your cursor. The light follows.
          </p>
        </div>
      </div>
    </section>
  );
}

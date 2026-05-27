"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Fade in background and text elements on scroll
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      if (formRef.current) {
        gsap.fromTo(
          formRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Premium completion animation
    setIsSubmitted(true);
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.fromTo(
            ".success-message",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
        },
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative bg-[var(--surface)] text-[var(--ink)] py-32 md:py-48 overflow-hidden"
      aria-label="Commission Your World"
    >
      {/* Background elegant architectural line */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center"
        aria-hidden="true"
      >
        <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="var(--bronze)" strokeWidth="0.1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="var(--bronze)" strokeWidth="0.1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--bronze)" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 flex flex-col items-center text-center">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-8 bg-[var(--champagne)]" />
          <span className="text-section-label">Inquire</span>
          <div className="h-px w-8 bg-[var(--champagne)]" />
        </div>

        <h2
          ref={titleRef}
          className="font-display font-bold leading-none tracking-tight mb-12 max-w-4xl"
          style={{ fontSize: "clamp(2.5rem, 6vw, 6.5rem)", letterSpacing: "-0.05em" }}
        >
          Commission your<br />
          <span className="font-editorial italic text-[var(--bronze)]">private world</span>
        </h2>

        {!isSubmitted ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-lg flex flex-col gap-6"
          >
            <div className="relative border-b border-[var(--stone)] pb-2 flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none text-[var(--ink)] placeholder-[var(--muted-ink)] focus:outline-none py-2 text-base font-light font-sans"
              />
              <button
                type="submit"
                className="absolute right-0 text-[var(--bronze)] hover:text-[var(--champagne)] transition-colors duration-300 uppercase tracking-widest text-xs font-semibold"
                aria-label="Submit inquiry"
              >
                Submit
              </button>
            </div>

            <div className="relative border-b border-[var(--stone)] pb-2 flex items-center">
              <input
                type="text"
                placeholder="Invitation code (optional)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-transparent border-none text-[var(--ink)] placeholder-[var(--muted-ink)] focus:outline-none py-2 text-base font-light font-sans"
              />
            </div>

            <p className="text-xs text-[var(--muted-ink)] tracking-wider mt-4">
              All submissions are treated with absolute discretion.
            </p>
          </form>
        ) : (
          <div className="success-message opacity-0 flex flex-col items-center gap-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--bronze)"
              strokeWidth="1"
              className="mb-2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h3 className="font-display font-medium text-2xl text-[var(--ink)]">
              Submission Received
            </h3>
            <p className="text-[var(--muted-ink)] text-sm max-w-md">
              A private liaison will contact you shortly to guide you through the AUREON experience.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="w-full border-t border-[var(--stone)]/30 mt-24 md:mt-36 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs text-[var(--muted-ink)] font-sans tracking-wide">
          <div>
            <h4 className="font-bold text-[var(--ink)] mb-3 tracking-widest uppercase">Office</h4>
            <p className="leading-relaxed">
              Bahnhofstrasse 12<br />
              8001 Zürich, Switzerland
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--ink)] mb-3 tracking-widest uppercase">Contact</h4>
            <p className="leading-relaxed">
              inquire@aureon.design<br />
              +41 44 211 00 00
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--ink)] mb-3 tracking-widest uppercase">Legal</h4>
            <p className="leading-relaxed mb-1">
              © {new Date().getFullYear()} AUREON. All rights reserved.
            </p>
            <p className="opacity-60">Design & Architecture without compromise.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

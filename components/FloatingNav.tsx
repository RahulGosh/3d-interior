"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";

const NAV_ITEMS = [
  { label: "AUREON", href: "#hero" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Worlds", href: "#anthology" },
  { label: "Craft", href: "#craft" },
  { label: "Services", href: "#services" },
  { label: "Consult", href: "#cta" },
];

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
      const sections = ["hero", "manifesto", "anthology", "craft", "services", "cta"];
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      id="floating-nav"
      role="navigation"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full glass-warm shadow-[0_4px_32px_rgba(138,106,62,0.08)]">
        {/* Logo mark */}
        <button
          onClick={() => handleNavClick("#hero")}
          className="flex items-center justify-center w-8 h-8 mr-2 rounded-full hover:bg-[rgba(200,169,106,0.1)] transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 20H2L12 2Z" stroke="var(--bronze)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 8L17 20H7L12 8Z" fill="var(--champagne)" opacity="0.4"/>
          </svg>
        </button>

        {NAV_ITEMS.map((item) => {
          const id = item.href.replace("#", "");
          const isActive = activeSection === id;
          return (
            <button
              key={item.href}
              id={`nav-${id}`}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative px-4 py-2 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-500",
                isActive ? "text-[var(--ink)]" : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-[rgba(200,169,106,0.12)] border border-[rgba(138,106,62,0.12)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden flex items-center justify-center w-12 h-12 rounded-full glass-warm shadow-[0_4px_32px_rgba(138,106,62,0.08)]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="flex flex-col gap-1">
          <motion.span
            className="w-4 h-[1px] bg-[var(--ink)] block"
            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 2.5 : 0 }}
          />
          <motion.span
            className="w-4 h-[1px] bg-[var(--ink)] block"
            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -2.5 : 0 }}
          />
        </div>
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-16 right-0 w-48 py-3 px-2 rounded-2xl glass-warm shadow-[0_8px_48px_rgba(138,106,62,0.12)]"
          >
            {NAV_ITEMS.map((item) => {
              const id = item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300",
                    activeSection === id
                      ? "text-[var(--ink)] bg-[rgba(200,169,106,0.1)]"
                      : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

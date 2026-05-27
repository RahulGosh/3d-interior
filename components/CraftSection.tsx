"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const CRAFT_STEPS = [
  {
    number: "01",
    title: "Material Selection",
    body: "Every surface begins with geology. We source travertine from Roman quarries, bronze from Florentine foundries, and glass from a single family atelier in Murano.",
  },
  {
    number: "02",
    title: "Structural Composition",
    body: "Engineering and poetry resolve their differences here. Cantilevers beyond 40 metres. Spans that breathe. Structures that seem to defy — but silently obey — physics.",
  },
  {
    number: "03",
    title: "Light Choreography",
    body: "We model light before we model walls. Where the sun strikes at 7am in December. Where shadows pool at dusk in summer. Light is the true architect.",
  },
  {
    number: "04",
    title: "Final Execution",
    body: "Artisans spend months on single joints. No prefabrication. No shortcuts. Construction is treated as the first act of habitation, not a mechanical prerequisite.",
  },
];

export default function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const visualRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  /* Procedural architectural wireframe animation */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const drawFrame = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      /* Background */
      ctx.fillStyle = "#17130F";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;

      /* Rotating architectural lines */
      ctx.save();
      ctx.translate(cx, cy);

      const rings = 6;
      for (let r = 0; r < rings; r++) {
        const radius = 60 + r * 40;
        const sides = 4 + r;
        const rot = t * (r % 2 === 0 ? 0.002 : -0.003) + (r * Math.PI) / rings;
        const alpha = 0.03 + (r === rings - 1 ? 0.12 : 0);

        ctx.beginPath();
        for (let s = 0; s <= sides; s++) {
          const angle = (s / sides) * Math.PI * 2 + rot;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(200,169,106,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      /* Grid lines */
      const gridSize = 40;
      const cols = Math.ceil(w / gridSize) + 2;
      const rows = Math.ceil(h / gridSize) + 2;
      ctx.restore();
      ctx.save();

      for (let c = -1; c < cols; c++) {
        const x = (c * gridSize + (t * 0.3) % gridSize) - cx;
        ctx.beginPath();
        ctx.moveTo(cx + x, 0);
        ctx.lineTo(cx + x, h);
        ctx.strokeStyle = "rgba(200,169,106,0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let r = -1; r < rows; r++) {
        const y = r * gridSize - cy;
        ctx.beginPath();
        ctx.moveTo(0, cy + y);
        ctx.lineTo(w, cy + y);
        ctx.strokeStyle = "rgba(200,169,106,0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      /* Central structure — simplified villa silhouette */
      ctx.save();
      ctx.translate(cx, cy);

      const scale = Math.min(w, h) * 0.25;
      const tiltX = Math.sin(t * 0.001) * 0.1;
      const tiltY = Math.cos(t * 0.0008) * 0.08;

      /* Villa outline points (simplified 2D projection with slight 3D tilt) */
      const pts = [
        [-1, 0.5], [-1, -0.2], [-0.6, -0.6], [0, -1],
        [0.6, -0.6], [1, -0.2], [1, 0.5],
      ].map(([x, y]) => ({
        x: (x + y * tiltX) * scale,
        y: (y + x * tiltY) * scale * 0.6,
      }));

      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.strokeStyle = "rgba(200,169,106,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Windows */
      const windows = [
        [-0.55, 0.05], [-0.2, 0.05], [0.2, 0.05], [0.55, 0.05],
        [-0.3, -0.35], [0.3, -0.35],
      ];
      windows.forEach(([wx, wy]) => {
        const x = (wx + (wy as number) * tiltX) * scale;
        const y = ((wy as number) + wx * tiltY) * scale * 0.6;
        const ww = 0.12 * scale, wh = 0.1 * scale * 0.6;
        ctx.beginPath();
        ctx.rect(x - ww / 2, y - wh / 2, ww, wh);
        ctx.strokeStyle = "rgba(200,169,106,0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.fillStyle = "rgba(200,169,106,0.04)";
        ctx.fill();
      });

      /* Pulsing center dot */
      const pulse = 0.6 + 0.4 * Math.sin(t * 0.015);
      ctx.beginPath();
      ctx.arc(0, 0, 3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,106,${0.6 * pulse})`;
      ctx.fill();

      ctx.restore();

      t++;
      animRef.current = requestAnimationFrame(drawFrame);
    };

    animRef.current = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Scroll animations */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(step,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          }
        );
      });

      if (visualRef.current) {
        gsap.fromTo(visualRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: visualRef.current, start: "top 75%" },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative bg-[var(--ink)] py-40 overflow-hidden"
      aria-label="The Craft"
    >
      <div className="px-8 md:px-16 lg:px-24">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-8 bg-[var(--champagne)]" />
          <span className="text-section-label text-[var(--stone)]">Process</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Steps */}
          <div>
            <h2
              className="font-display font-bold text-[var(--surface)] mb-16 leading-none tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.05em" }}
            >
              Built by<br />
              <span className="font-editorial italic text-[var(--champagne)]">obsessives</span>
            </h2>

            <div className="space-y-12">
              {CRAFT_STEPS.map((step, i) => (
                <div
                  key={step.number}
                  ref={(el) => { stepsRef.current[i] = el; }}
                  className="flex gap-8 group"
                  style={{ opacity: 0 }}
                >
                  <div className="flex-shrink-0 pt-1">
                    <span className="font-display text-[var(--champagne)] text-xs tracking-[0.2em] opacity-60">
                      {step.number}
                    </span>
                  </div>
                  <div className="border-t border-white/8 pt-6 flex-1">
                    <h3 className="font-display font-semibold text-[var(--surface)] text-lg mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[var(--muted-ink)] text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Canvas visualization */}
          <div
            ref={visualRef}
            className="sticky top-24 rounded-2xl overflow-hidden"
            style={{ opacity: 0, height: "60vh" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              aria-label="Architectural wireframe visualization"
            />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-section-label text-[var(--muted-ink)] text-[10px]">
                  Parametric modelling — real-time
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

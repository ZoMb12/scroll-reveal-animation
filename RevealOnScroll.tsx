"use client";

import { useEffect, useRef, Children, cloneElement, isValidElement } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Entry direction. Exit direction is auto-detected. */
  direction?: "up" | "left" | "right";
  /** Children appear one-by-one with cascading delay. */
  stagger?: boolean;
}

/**
 * Wraps content in a scroll-driven reveal animation.
 *
 * - Entrance: slides in from the specified direction when scrolled into view.
 * - Exit: slides out the direction the element left the viewport (auto-detected).
 * - Stagger: direct children get incremental CSS transition-delay via --i.
 *
 * Requires reveal-animation.css in your global stylesheet.
 */
export function RevealOnScroll({
  children,
  className = "",
  direction = "up",
  stagger = false,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // ── ENTER ──
          if (stagger) {
            el.classList.add("visible");
            const items = el.querySelectorAll<HTMLElement>(".reveal-stagger");
            items.forEach((item) => item.classList.add("visible"));
          } else {
            el.classList.add("visible");
          }
        } else {
          // ── EXIT: detect which edge the element left from ──
          const rect = entry.boundingClientRect;
          const exitY = rect.top < 0 ? "-60px" : "60px";
          const exitX = rect.left < 0 ? "-60px" : "60px";
          (el as HTMLElement).style.setProperty("--exit-y", exitY);
          (el as HTMLElement).style.setProperty("--exit-x", exitX);
          el.classList.remove("visible");
          if (stagger) {
            const items = el.querySelectorAll<HTMLElement>(".reveal-stagger");
            items.forEach((item) => item.classList.remove("visible"));
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" :
    "reveal";

  if (stagger) {
    // ⚠️ Spread original style to preserve inline styles (e.g. gridTemplateColumns)
    const wrapped = Children.map(children, (child, i) => {
      if (isValidElement(child)) {
        return cloneElement(
          child as React.ReactElement<{ className?: string; style?: React.CSSProperties }>,
          {
            style: { ...(child.props as any).style, "--i": i } as React.CSSProperties,
            className: `${(child.props as any).className || ""} reveal-stagger`.trim(),
          }
        );
      }
      return child;
    });

    return (
      <div ref={ref} className={`${dirClass} ${className}`}>
        {wrapped}
      </div>
    );
  }

  return (
    <div ref={ref} className={`${dirClass} ${className}`}>
      {children}
    </div>
  );
}

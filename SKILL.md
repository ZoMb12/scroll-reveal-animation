---
name: scroll-reveal-animation
description: |
  Build scroll-driven reveal/exit animations with direction-aware slide-out, staggered children, and a single IntersectionObserver + CSS transition approach. Use this skill whenever the user asks for scroll animations, "reveal on scroll", "elements sliding in as you scroll", entrance/exit scroll effects, staggered card animations, or wants to add scroll-triggered transitions to a React/Next.js project. Also trigger when the user says things like "make elements appear as I scroll down", "animate sections into view", or "add scroll-based entrance effects".
---

# Scroll Reveal Animation System

A lightweight scroll-driven animation system using one `IntersectionObserver` per wrapper + CSS transitions. No animation library dependency — just React + CSS.

## Why This Approach

- **Zero dependencies** — no framer-motion, GSAP, or AOS needed
- **Direction-aware exit** — elements slide out the direction they left the viewport (up if scrolled off top, down if off bottom, left/right for horizontal)
- **Stagger without JS timers** — uses CSS `transition-delay` with a `--i` custom property, so children cascade naturally
- **Single observer per section** — each `<RevealOnScroll>` creates its own `IntersectionObserver`, which auto-cleans up on unmount

---

## CSS Setup

Place this in your global CSS. Three animation classes + one stagger class:

```css
:root {
  --ease-spring: cubic-bezier(.165, .84, .44, 1);
}

/* ── Base reveal (slides up from below by default) ── */
.reveal {
  opacity: 0;
  transform: translateY(var(--exit-y, 60px));
  transition: opacity 1s var(--ease-spring), transform 1s var(--ease-spring);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Left / Right variants ── */
.reveal-left {
  opacity: 0;
  transform: translateX(var(--exit-x, -60px));
  transition: opacity 1s var(--ease-spring), transform 1s var(--ease-spring);
}

.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(var(--exit-x, 60px));
  transition: opacity 1s var(--ease-spring), transform 1s var(--ease-spring);
}

.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── Stagger child ── */
.reveal-stagger {
  opacity: 0;
  transform: translateY(var(--exit-y, 60px));
  transition: opacity 1s var(--ease-spring), transform 1s var(--ease-spring);
}

.reveal-stagger.visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: calc(var(--i, 0) * 0.06s);
}
```

**Key detail:** The default values for `--exit-y` (60px) and `--exit-x` (60px) match the entrance direction — elements enter FROM below, exit TO below. The JS dynamically flips the sign when the element leaves the OTHER way.

---

## React Component

```tsx
"use client";

import { useEffect, useRef, Children, cloneElement, isValidElement } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  stagger?: boolean;  // child elements appear one-by-one with cascading delay
}

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
      { threshold: 0.3 }  // see threshold tuning below
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" :
    "reveal";

  if (stagger) {
    // ⚠️ CRITICAL: spread original style to preserve inline styles like gridTemplateColumns
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
```

---

## Usage Patterns

### Basic: wrap any section

```tsx
<RevealOnScroll>
  <section>
    <h2>My Section</h2>
    <p>This slides up from below when scrolled into view.</p>
  </section>
</RevealOnScroll>
```

### Stagger: cards cascade one-by-one

```tsx
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>
```

Each direct child gets `--i: 0`, `--i: 1`, `--i: 2`… and `transition-delay: calc(var(--i) * 0.06s)`, so they appear sequentially.

### Text/Image Separation (recommended for production)

Split headers and content into independent `RevealOnScroll` units. The text slides in first, then the cards follow as the user continues scrolling:

```tsx
<section>
  {/* Text block enters first */}
  <RevealOnScroll>
    <div className="mb-10">
      <span className="label">Section Label</span>
      <h2>Section Title</h2>
    </div>
  </RevealOnScroll>

  {/* Cards enter next — each row can be separate */}
  <RevealOnScroll stagger>
    <div className="grid grid-cols-4 gap-4">
      {row1Products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </RevealOnScroll>

  <RevealOnScroll stagger>
    <div className="grid grid-cols-4 gap-4 mt-4">
      {row2Products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </RevealOnScroll>
</section>
```

### Direction variants

```tsx
<RevealOnScroll direction="left">   {/* slides in from left */}
<RevealOnScroll direction="right">  {/* slides in from right */}
```

---

## ⚠️ Critical Gotcha: cloneElement style merge

When `stagger` is enabled, `cloneElement` merges the new props into the child. If you write:

```tsx
// ❌ WRONG — overwrites original inline styles!
cloneElement(child, {
  style: { "--i": i },
  ...
})
```

This **replaces** `child.props.style` entirely. Any inline styles on the child (like `gridTemplateColumns` from `style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}`) are **lost**, breaking the layout.

**Always spread the original style:**

```tsx
// ✅ CORRECT
cloneElement(child, {
  style: { ...(child.props as any).style, "--i": i },
  ...
})
```

---

## Threshold Tuning

The `threshold` in `IntersectionObserver` controls when entrance and exit fire:

| Value | Entrance | Exit | Effect |
|-------|----------|------|--------|
| `0` | As soon as 1px enters | When fully out | Subtle — exit barely visible |
| `0.1` | 10% visible | 90% left | Moderate |
| `0.3` | 30% visible | 70% left | **Bold** — animation is clearly visible while element is still substantially in view |

**Recommendation:** Use `0.3` for a premium feel — users see the full slide-in/out while the element is still prominent. Use `0.1` for subtle, fast-scrolling contexts.

The same threshold controls BOTH entrance and exit. If you need asymmetric behavior (e.g., enter at 10%, exit at 30%), pass an array: `threshold: [0.1, 0.3]`.

---

## How Exit Direction Works

When an element leaves the viewport, the observer fires with `!isIntersecting`. At that moment, `entry.boundingClientRect` tells us which edge it crossed:

- `rect.top < 0` → element scrolled off the **top** → exit UP (`--exit-y: -60px`)
- `rect.top > 0` → element scrolled off the **bottom** → exit DOWN (`--exit-y: 60px`)
- `rect.left < 0` → element scrolled off the **left** → exit LEFT (`--exit-x: -60px`)
- `rect.left > 0` → element scrolled off the **right** → exit RIGHT (`--exit-x: 60px`)

The CSS variable is set on the wrapper element **before** `.visible` is removed, so the transition animates smoothly from `translateY(0)` to `translateY(var(--exit-y))`.

Without this logic, all elements would always exit downward regardless of scroll direction — looking broken when scrolling back up.

---

## Easing

The spring-like easing `cubic-bezier(.165, .84, .44, 1)` gives a "deceleration into place" feel — it overshoots slightly and settles. If you prefer linear or ease-out:

```css
--ease-spring: cubic-bezier(0.4, 0, 0.2, 1);  /* Material ease-out */
--ease-spring: cubic-bezier(0, 0, 0.2, 1);    /* Standard ease-out */
```

---

## Quick Reference: File Checklist

When adding this system to a new project, you need exactly two files:

1. **CSS** — the `.reveal`, `.reveal.visible`, `.reveal-left`, `.reveal-right`, `.reveal-stagger`, `.reveal-stagger.visible` classes
2. **Component** — `RevealOnScroll.tsx` (client component in Next.js, or any React component)

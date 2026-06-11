---
name: scroll-reveal-animation
description: |
  Build scroll-driven reveal/exit animations with direction-aware slide-out,
  staggered children, and a single IntersectionObserver + CSS transition
  approach. Use this skill whenever the user asks for scroll animations,
  "reveal on scroll", "elements sliding in as you scroll", entrance/exit
  scroll effects, staggered card animations, or wants to add scroll-triggered
  transitions to a React/Next.js project. Also trigger when the user says
  things like "make elements appear as I scroll down", "animate sections
  into view", or "add scroll-based entrance effects".
---

# Scroll Reveal Animation System

A lightweight scroll-driven animation system using one `IntersectionObserver`
per wrapper + CSS transitions. Zero dependencies — just React + CSS.

## File Map

| File | Purpose | When to read |
|------|---------|--------------|
| `RevealOnScroll.tsx` | React component — copy to `src/components/ui/` | Always — this is the deliverable |
| `reveal-animation.css` | CSS classes — copy to global stylesheet | Always — this is the deliverable |
| `references/usage-patterns.md` | Common layout patterns + examples | Need more complex layouts |

---

## Why This Approach

- **Zero dependencies** — no framer-motion, GSAP, or AOS needed
- **Direction-aware exit** — elements slide out the direction they left the
  viewport (up if scrolled off top, down if off bottom, left/right for
  horizontal)
- **Stagger without JS timers** — uses CSS `transition-delay` with a `--i`
  custom property, so children cascade naturally
- **Single observer per section** — each `<RevealOnScroll>` creates its own
  `IntersectionObserver`, which auto-cleans up on unmount

---

## Phase 1: Install — Copy Two Files

Copy these files into the project:

1. **`RevealOnScroll.tsx`** → `src/components/ui/RevealOnScroll.tsx`
2. **`reveal-animation.css`** → import in global stylesheet (`globals.css` or `layout.tsx`):
   ```tsx
   import "@/styles/reveal-animation.css";
   ```

That's it. No `npm install`, no config.

---

## Phase 2: Basic Usage

Wrap any section in `<RevealOnScroll>`. The content slides up from below when
scrolled into view, and slides out the direction it left when scrolled back.

```tsx
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

<RevealOnScroll>
  <section>
    <h2>Features</h2>
    <p>This slides up from below when scrolled into view.</p>
  </section>
</RevealOnScroll>
```

Each wrapper creates its own `IntersectionObserver`. Cleanup is automatic on
unmount.

---

## Phase 3: Stagger Mode

Pass `stagger` to make children appear one-by-one with cascading delay.

```tsx
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>
```

Each direct child receives `--i: 0`, `--i: 1`, `--i: 2`… The CSS applies
`transition-delay: calc(var(--i) * 0.06s)`.

### ⚠️ Critical: cloneElement Style Override

When `stagger` is enabled, the component uses `cloneElement` to inject `--i`
onto each child. If you overwrite `style` without spreading the original,
**inline styles are destroyed** — breaking grid layouts, dimensions, etc.

```tsx
// ❌ WRONG — destroys inline styles like gridTemplateColumns
cloneElement(child, { style: { "--i": i } })

// ✅ CORRECT
cloneElement(child, {
  style: { ...(child.props as any).style, "--i": i },
})
```

This is the #1 bug people hit. Always spread the original style.

---

## Phase 4: Text/Image Separation

For polished layouts, split headers and content into independent
`RevealOnScroll` units. Text slides in first, then cards follow as the user
continues scrolling:

```tsx
<section>
  <RevealOnScroll>
    <div className="mb-10">
      <span className="label">Section Label</span>
      <h2>Section Title</h2>
    </div>
  </RevealOnScroll>

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

Mobile-only links should also get their own wrapper:

```tsx
<RevealOnScroll>
  <div className="mt-8 text-center md:hidden">
    <Link href="/all">Browse All</Link>
  </div>
</RevealOnScroll>
```

Refer to `references/usage-patterns.md` for more patterns.

---

## Phase 5: Direction Variants

```tsx
<RevealOnScroll direction="left">   {/* slides in from left */}
<RevealOnScroll direction="right">  {/* slides in from right */}
```

Default direction is `"up"`. Exit direction is **auto-detected** regardless
of the entry setting — the component checks `entry.boundingClientRect` on exit
to determine which edge was crossed.

---

## Phase 6: Threshold Tuning

The `threshold` in the component determines when entrance/exit fires:

| Value | Entrance at | Exit at | Effect |
|-------|------------|---------|--------|
| `0` | 1px visible | fully out | Subtle — exit barely visible |
| `0.1` | 10% visible | 90% left | Moderate |
| `0.3` | 30% visible | 70% left | **Bold — recommended default** |

To change: edit the `threshold: 0.3` in `RevealOnScroll.tsx`. For asymmetric
behavior (enter at 10%, exit at 30%), pass `threshold: [0.1, 0.3]`.

---

## How Exit Direction Works

When an element leaves the viewport, `!isIntersecting` fires. At that moment,
`entry.boundingClientRect` tells us which edge was crossed:

- `rect.top < 0` → scrolled off **top** → exit UP (`--exit-y: -60px`)
- `rect.top > 0` → scrolled off **bottom** → exit DOWN (`--exit-y: 60px`)
- `rect.left < 0` → scrolled off **left** → exit LEFT (`--exit-x: -60px`)
- `rect.left > 0` → scrolled off **right** → exit RIGHT (`--exit-x: 60px`)

The CSS variable is set **before** `.visible` is removed, so the transition
animates smoothly from `translateY(0)` to `translateY(var(--exit-y))`.

Without this logic, all elements always exit downward — looking broken when
scrolling back up.

---

## Easing

The default spring easing `cubic-bezier(.165,.84,.44,1)` gives a premium
deceleration-into-place feel. To customize, override `--ease-spring` in your
CSS:

```css
:root {
  --ease-spring: cubic-bezier(0.4, 0, 0.2, 1);  /* Material ease-out */
  --ease-spring: cubic-bezier(0, 0, 0.2, 1);    /* Standard ease-out */
}
```

---

## Implementation Checklist

- [ ] Copy `RevealOnScroll.tsx` to the project's `src/components/ui/`
- [ ] Copy `reveal-animation.css` to the project's global styles
- [ ] Import CSS in `layout.tsx` or `globals.css`
- [ ] Wrap hero/sections with basic `<RevealOnScroll>`
- [ ] Add `stagger` prop to card grids for cascading effect
- [ ] Split text headers and card rows into separate wrappers
- [ ] Add separate wrappers for mobile-only links
- [ ] Tune threshold if needed (default 0.3 is good for most cases)

# Scroll Reveal Animation

Zero-dependency scroll-driven reveal/exit animations for React & Next.js. One `IntersectionObserver` + CSS transitions.

## Features

- **Direction-aware exit** — elements slide out the way they left the viewport (up/down/left/right)
- **Stagger cascade** — children appear one-by-one with CSS `transition-delay`, no JS timers
- **Zero dependencies** — no framer-motion, GSAP, or AOS
- **2 files** — one React component + ~50 lines of CSS

## Quick Start

### 1. Copy the CSS

Add [`reveal-animation.css`](./reveal-animation.css) to your global stylesheet.

### 2. Copy the component

Add [`RevealOnScroll.tsx`](./RevealOnScroll.tsx) to your components directory.

### 3. Use it

```tsx
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

// Basic
<RevealOnScroll>
  <section>
    <h2>My Section</h2>
    <p>This slides up when scrolled into view.</p>
  </section>
</RevealOnScroll>

// With stagger — children appear one-by-one
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes on wrapper |
| `direction` | `"up"` \| `"left"` \| `"right"` | `"up"` | Entry direction |
| `stagger` | `boolean` | `false` | Children cascade with incremental delay |

## How It Works

The wrapper div starts at `opacity: 0` with a CSS transform offset (e.g., `translateY(60px)`). An `IntersectionObserver` watches the element — when it enters the viewport, a `.visible` class is added, triggering the CSS transition to `opacity: 1; transform: translateY(0)`.

On exit, the observer reads `boundingClientRect` to determine which edge the element crossed, sets a CSS variable (`--exit-y` or `--exit-x`), and removes `.visible` — causing the element to slide out in the correct direction.

See [`SKILL.md`](./SKILL.md) for the full design rationale, threshold tuning guide, and known gotchas.

## License

MIT

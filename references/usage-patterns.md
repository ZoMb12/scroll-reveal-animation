# Scroll Reveal — Usage Patterns

## Basic: Wrap Any Section

```tsx
<RevealOnScroll>
  <section>
    <h2>My Section</h2>
    <p>This slides up from below when scrolled into view.</p>
  </section>
</RevealOnScroll>
```

Each `<RevealOnScroll>` creates one `IntersectionObserver`. When the wrapped
element enters the viewport (30% visible), `.visible` is added → CSS
transition fires → element fades in and slides up.

## Stagger: Cards Cascade One-by-One

```tsx
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>
```

Each direct child gets `--i: 0`, `--i: 1`, `--i: 2`… The CSS applies
`transition-delay: calc(var(--i) * 0.06s)`, so they appear sequentially with
60ms gaps.

**⚠️ When using `stagger`, cloneElement merges props.** If you overwrite the
child's `style` without spreading the original, grid layouts break:

```tsx
// ❌ WRONG — destroys inline styles like gridTemplateColumns
cloneElement(child, { style: { "--i": i } })

// ✅ CORRECT
cloneElement(child, {
  style: { ...(child.props as any).style, "--i": i },
})
```

## Text/Image Separation (Recommended)

Split headers and content into independent `<RevealOnScroll>` units. The text
slides in first, then the cards follow as the user continues scrolling:

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

This creates a layered reveal: heading → row 1 → row 2, with each row
revealing cards in cascading sequence.

## Direction Variants

```tsx
<RevealOnScroll direction="left">   {/* slides in from left */}
<RevealOnScroll direction="right">  {/* slides in from right */}
```

Default direction is `"up"` — elements enter from below. Exit direction is
auto-detected regardless of the entry direction setting.

## Mobile Links

Mobile-specific navigation links should have their own `<RevealOnScroll>` so
they animate independently from the main content:

```tsx
<RevealOnScroll>
  <div className="mt-8 text-center md:hidden">
    <Link href="/all">Browse All <ArrowRight /></Link>
  </div>
</RevealOnScroll>
```

## Easing Customization

```css
:root {
  --ease-spring: cubic-bezier(.165,.84,.44,1);  /* default: spring deceleration */
  --ease-spring: cubic-bezier(0.4, 0, 0.2, 1);  /* Material ease-out */
  --ease-spring: cubic-bezier(0, 0, 0.2, 1);    /* Standard ease-out */
}
```

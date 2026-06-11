# Scroll Reveal Animation ✨

> Drop-in React component for scroll-driven reveal/exit animations. Zero dependencies. One component + one CSS file. Works in any React/Next.js project.

[English](#english) | [中文](#中文) | [For AI Agents](#for-ai-agents)

---

## English

### What is this?

A **Claude Code Skill** that gives you a ready-to-use scroll animation system. Two files — a React component and a CSS stylesheet — that you copy into your project. Wrap any section in `<RevealOnScroll>` and it slides into view as the user scrolls down, then slides out the way it left when the user scrolls back up.

No npm install. No animation library. Just React + CSS.

### What you get

- **⬆️⬇️⬅️➡️ Direction-aware exit** — elements exit the direction they left the viewport (up if scrolled past, down if scrolled off bottom, left/right if horizontal)
- **🎬 Stagger children** — cards cascade one-by-one with `--i` CSS delays instead of JS timers
- **🔧 Single observer** — one `IntersectionObserver` per wrapper, auto-cleanup on unmount
- **🎨 Spring easing** — `cubic-bezier(.165,.84,.44,1)` gives a premium deceleration feel
- **📦 0 dependencies** — no framer-motion, GSAP, or AOS needed

### How to use

**Step 1:** Install the skill in Claude Code:

```
/install-skill https://github.com/ZoMb12/scroll-reveal-animation
```

**Step 2:** Tell your AI:

> *"Use the scroll-reveal-animation skill to add scroll animations to the homepage sections."*

The AI will copy `RevealOnScroll.tsx` and `reveal-animation.css` into your
project, wire them up, and wrap your sections.

**Or manually:** Copy the two files yourself and import them.

### Quick Example

```tsx
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
// + import "reveal-animation.css" in your global CSS

// Basic: any section slides up on scroll
<RevealOnScroll>
  <section>
    <h2>Features</h2>
    <p>This slides up from below when scrolled into view.</p>
  </section>
</RevealOnScroll>

// Stagger: cards appear one at a time
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>

// Text first, then cards — separate observers
<RevealOnScroll>
  <h2>Section Title</h2>
</RevealOnScroll>
<RevealOnScroll stagger>
  <div className="grid grid-cols-4 gap-4">{cards}</div>
</RevealOnScroll>
```

### How it works

```
Scroll down → element enters viewport (30% visible) → .visible added
                                                       → opacity 0→1
                                                       → translateY 60px→0
Scroll up   → element leaves viewport                  → .visible removed
                                                       → exit direction detected
                                                       → slides out that way
```

### Project Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Full skill guide — AI reads this |
| `RevealOnScroll.tsx` | React component — copy to your project |
| `reveal-animation.css` | CSS classes — copy to your global stylesheet |

---

## 中文

### 这是什么？

一个 **Claude Code 技能**，给你一套即装即用的滚动动画系统。只需两个文件——一个 React 组件和一个 CSS 文件——复制到你的项目中。用 `<RevealOnScroll>` 包裹任意区块，它就会在用户向下滚动时滑入，在用户向上回滚时朝着离开方向滑出。

无需 npm install，无需动画库。纯 React + CSS。

### 你能得到什么

- **⬆️⬇️⬅️➡️ 方向感知退出** — 元素从哪个方向离开视口就从哪个方向滑出（向上滚过→向上滑出，向下滚出→向下滑出）
- **🎬 子元素错位** — 卡片通过 `--i` CSS 延迟逐个出现，无需 JS 定时器
- **🔧 单观察器** — 每个 `<RevealOnScroll>` 创建自己的 `IntersectionObserver`，组件卸载自动清理
- **🎨 弹簧缓动** — `cubic-bezier(.165,.84,.44,1)` 带来高级减速到位感
- **📦 零依赖** — 不需要 framer-motion、GSAP、AOS

### 怎么用

**第一步：** 在 Claude Code 中安装技能：

```
/install-skill https://github.com/ZoMb12/scroll-reveal-animation
```

**第二步：** 告诉你的 AI：

> *"使用 scroll-reveal-animation 技能给首页各个区块加上滚动动画。"*

AI 会自动把 `RevealOnScroll.tsx` 和 `reveal-animation.css` 复制到你的项目里并配置好。

**或者手动：** 自己复制两个文件并引入。

### 快速示例

```tsx
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
// 在全局 CSS 中引入 reveal-animation.css

// 基础用法：任意区块向上滑入
<RevealOnScroll>
  <section>
    <h2>功能特性</h2>
    <p>滚动到此处时从下方滑入。</p>
  </section>
</RevealOnScroll>

// 错位模式：卡片逐个出现
<RevealOnScroll stagger>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</RevealOnScroll>

// 文字先行，卡片后到 — 各自独立观察
<RevealOnScroll>
  <h2>区块标题</h2>
</RevealOnScroll>
<RevealOnScroll stagger>
  <div className="grid grid-cols-4 gap-4">{cards}</div>
</RevealOnScroll>
```

### 原理

```
向下滚 → 元素进入视口 (30% 可见) → .visible 添加
                                   → opacity 0→1
                                   → translateY 60px→0
向上滚 → 元素离开视口              → .visible 移除
                                   → 检测离开方向
                                   → 朝那个方向滑出
```

---

## For AI Agents

> **You are an AI coding agent. Read this section to quickly understand this skill.**

### TL;DR

This skill provides a **drop-in React scroll animation component**. Copy two
files into the user's project, wrap sections in `<RevealOnScroll>`, done.

### What to do

1. Read `SKILL.md` — it has the complete component source and CSS
2. Copy `RevealOnScroll.tsx` to the project's components (e.g., `src/components/ui/`)
3. Copy `reveal-animation.css` to the project's global styles (or merge into `globals.css`)
4. Import and wrap sections that need scroll animation

### Key design decisions

- **Zero dependencies** — pure React + CSS, no npm install needed
- **Direction-aware exit** — detects scroll direction on exit and flips the `--exit-y` / `--exit-x` CSS variable
- **Stagger works via CSS `transition-delay`** with `--i` custom property — no JS timers
- **One `IntersectionObserver` per wrapper** — each `<RevealOnScroll>` creates its own, cleans up on unmount
- **Threshold: 0.3** — element is 30% visible before triggering (bold, premium feel)

### ⚠️ Critical: cloneElement style override

When using `stagger` mode, `cloneElement` merges props. If you overwrite the
child's `style` prop without spreading the original, you'll break layouts:

```tsx
// ❌ WRONG — destroys inline styles like gridTemplateColumns
cloneElement(child, { style: { "--i": i } })

// ✅ CORRECT
cloneElement(child, {
  style: { ...(child.props as any).style, "--i": i },
})
```

### Props reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to animate |
| `className` | `string` | `""` | Additional wrapper classes |
| `direction` | `"up"` \| `"left"` \| `"right"` | `"up"` | Entry direction |
| `stagger` | `boolean` | `false` | Cascade children one-by-one |

### Threshold tuning

| Value | Effect |
|-------|--------|
| `0.3` | Bold — animation visible while element is prominent **(recommended)** |
| `0.1` | Subtle — for fast-scrolling contexts |
| `[0.1, 0.3]` | Asymmetric — enter at 10%, exit at 30% |

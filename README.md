# 🚀 Bharath Raj M — Portfolio

A premium, interactive portfolio website built with **Next.js 16**, **Framer Motion**, and **Tailwind CSS v4**. Features a custom dual-circle cursor with ripple effects, scroll-triggered reveal animations, and a stunning dark theme with gold & blue accents.

![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)

---

## ✨ Features

### 🎨 Design & Aesthetics
- **Dark premium theme** with CSS custom properties (`--gold`, `--blue`, `--orange`)
- **Glassmorphism cards** with backdrop blur, subtle borders, and inner glow
- **Google Fonts** — Playfair Display (headings) + DM Sans (body)
- **Gradient accents** — gold-to-orange skill bars, blue skill bars, animated hero photo border
- **Custom scrollbar** styled to match the dark theme

### 🖱️ Custom Cursor & Ripple System
- **Dual-circle cursor** — outer ring (36px, gold border with glow) + inner dot (8px, solid gold)
- **Hover expansion** — cursor grows to 56px with orange glow on interactive elements
- **Canvas-based ripple effect** — particles emit on mouse movement and burst on click
- **Ripple colors** — alternating gold/blue on move, gold/orange on click

### 📜 Scroll Animations
- **Reveal** — elements fade up (translateY 40px → 0) when scrolled into view
- **RevealLeft / RevealRight** — elements slide horizontally from left or right
- **Staggered delays** — sequential reveal for lists, cards, and timeline items
- **Skill bar animation** — progress bars animate width on scroll with spring easing
- **Counter animation** — stat numbers count up from 0 when visible
- **Parallax** — hero text shifts vertically on scroll

### 📐 Sections
| Section | Description |
|---------|-------------|
| **Hero** | Full-viewport intro with animated photo border, floating badges, and parallax text |
| **About** | Two-column layout with bio text (left) and animated stat counters (right) |
| **Skills** | Dual skill panels — Data Science/AI (gold bars) and Full-Stack Python (blue bars) |
| **Experience** | Vertical timeline with glowing dots, current/past badges, staggered reveal |
| **Projects** | Tabbed interface (AI, Full-Stack, BI) with animated card transitions |
| **Research** | Side-by-side research cards with research questions, tech tags, and key insights |
| **Training** | Teaching curriculum, live batch indicator, placement stats |
| **Education** | Academic credentials with icon card layout |
| **Contact** | Contact links + glass-styled form with Subject and Message fields |
| **Footer** | Credits and attribution |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.1 (App Router, Turbopack) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 + Vanilla CSS custom properties |
| **Animations** | Framer Motion 12 (`whileInView`, `AnimatePresence`, `useScroll`) |
| **Icons** | Lucide React + Custom SVG (GitHub icon) |
| **Fonts** | Google Fonts (DM Sans, Playfair Display) |

---

## 📦 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/bharathrajm/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
my-portfolio/
├── app/
│   ├── globals.css        # Complete design system — variables, glass, buttons, layout, animations
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main portfolio page — all components and sections
├── public/                # Static assets (add your profile photo here)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### Key Files

- **`app/page.tsx`** — Single-file component architecture with:
  - `CustomCursor` — Canvas ripple + dual-circle cursor
  - `Reveal` / `RevealLeft` / `RevealRight` — Scroll animation wrappers
  - `SkillBar` — Animated progress bars with `useInView`
  - `Counter` — Scroll-triggered count-up numbers
  - Section components: `Hero`, `About`, `Skills`, `Experience`, `Projects`, `Research`, `Training`, `Contact`

- **`app/globals.css`** — Complete design tokens and utility classes:
  - CSS custom properties for theming
  - `.glass` — Glassmorphism mixin
  - `.btn-gold`, `.btn-orange`, `.btn-outline` — Button variants
  - Timeline, tabs, cards, forms — all responsive
  - `@keyframes` for floating badges, border rotation, pulse effects

---

## 🎯 Customization

### Replace Profile Photo
Replace the placeholder image URL in the Hero section of `app/page.tsx`:

```tsx
// Change this:
<img src="https://via.placeholder.com/340x420/133e7c/f0f3f8?text=Your+Photo" />

// To your actual image:
<img src="/your-photo.jpg" />
```

Place your image file in the `public/` directory.

### Update Content
All text content is in `app/page.tsx` — update the data arrays for:
- Experience timeline items
- Project cards (AI, Full-Stack, BI tabs)
- Research cards
- Training curriculum
- Contact links

### Change Colors
Edit CSS variables in `app/globals.css`:

```css
:root {
  --bg: #07111f;        /* Background */
  --blue: #133e7c;      /* Accent blue */
  --gold: #f5b700;      /* Primary highlight */
  --orange: #f46036;    /* Secondary highlight */
  --light: #f0f3f8;     /* Text color */
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

### Other Platforms
The project exports as a standard Next.js application and can be deployed on:
- **Netlify** — with `@netlify/plugin-nextjs`
- **AWS Amplify**
- **Docker** — using `next start` after `next build`

---

## 📄 License

© 2026 Bharath Raj M. All Rights Reserved.

---

## 🙏 Credits

- **Design & Development** — Bharath Raj M
- **Framework** — [Next.js](https://nextjs.org)
- **Animations** — [Framer Motion](https://www.framer.com/motion/)
- **Icons** — [Lucide](https://lucide.dev)
- **Fonts** — [Google Fonts](https://fonts.google.com)
- **Cursor & Ripple Inspiration** — Custom implementation

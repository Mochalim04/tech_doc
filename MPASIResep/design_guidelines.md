# MPASI Pintar - Design Guidelines

## Design Approach
**Hybrid Approach**: Combining utility-focused design system principles with warm, approachable healthcare aesthetics. Drawing inspiration from health/wellness platforms like BabyCenter and Healthline while maintaining simplicity for diverse age groups (young parents to grandparents).

## Core Design Principles
- **Trustworthy & Educational**: Establish credibility through clean layouts and clear information hierarchy
- **Warmly Accessible**: Welcoming color palette and generous spacing to reduce cognitive load
- **Multi-Generational Usability**: Large touch targets, high contrast, simple navigation for all ages

---

## Color Palette

### Light Mode (Primary)
**Primary Colors**:
- Soft Sage Green: 140 35% 65% (trust, health, nature)
- Warm Cream Background: 45 30% 96%
- Deep Teal Accent: 175 45% 45% (credibility, CTAs)

**Neutral Shades**:
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 50%
- Borders/Dividers: 220 15% 90%

**Semantic Colors**:
- Success (saved recipes): 140 50% 55%
- Info (age-appropriate tags): 200 60% 60%
- Warning (dietary notes): 35 85% 65%

### Dark Mode
- Background: 220 20% 12%
- Surface: 220 15% 18%
- Primary adjusted: 140 30% 55%
- Text: 45 15% 92%

---

## Typography

**Font Stack**: 
- Primary: 'Inter' or 'DM Sans' from Google Fonts (excellent readability at all sizes)
- Fallback: system-ui, -apple-system, sans-serif

**Scale** (Mobile → Desktop):
- Headings H1: text-3xl → text-5xl (bold, 700)
- Headings H2: text-2xl → text-4xl (semibold, 600)
- Headings H3: text-xl → text-2xl (semibold, 600)
- Body Large: text-lg → text-xl (recipe instructions, key info)
- Body Regular: text-base → text-lg (normal, 400)
- Caption: text-sm → text-base (metadata, sources)

**Line Heights**: Generous spacing - leading-relaxed (1.75) for body text, leading-snug (1.375) for headings

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20 for consistency
- Component padding: p-6 (mobile) → p-8 (desktop)
- Section spacing: py-12 → py-20
- Card gaps: gap-6 → gap-8

**Container Strategy**:
- Max width: max-w-7xl for full sections
- Content width: max-w-4xl for forms and recipe content
- Reading width: max-w-2xl for instructional text

**Grid Systems**:
- Recipe cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Input forms: Single column on mobile, 2-column on desktop where appropriate
- Ingredient lists: 2-column layout on tablets+

---

## Component Library

### Hero Section
- **NOT** a traditional centered hero
- **Instead**: Warm, illustrative banner (300px height mobile, 400px desktop) featuring soft illustrated elements (vegetables, baby bowl, spoon)
- Headline + subheading overlaid with semi-transparent sage green background (bg-opacity-90)
- Single prominent CTA: "Mulai Cari Resep" (Start Finding Recipes)

### Input Form Cards
- Elevated cards with soft shadows (shadow-lg)
- Large input fields: h-14 minimum, text-lg
- Rounded corners: rounded-xl
- Clear labels above inputs (text-base, font-semibold)
- Ingredient tags: Pill-shaped (rounded-full) with soft colors, large text, easy-tap removal
- Dropdown selects: Custom styled with large touch targets (min-h-14)

### Recipe Cards
- Clean white/surface cards with subtle border
- Recipe image: 16:9 aspect ratio, rounded-t-xl
- Age badge: Absolute positioned top-right, rounded-full with age range (e.g., "6-9 bulan")
- Time badge: Clock icon + minutes, positioned top-left
- Title: text-xl font-semibold, 2 lines max
- Brief description: text-base text-secondary, 3 lines max
- CTA buttons: Full-width at bottom, h-12

### Recipe Detail Layout
- Split layout desktop: 60% instructions / 40% ingredients sidebar
- Mobile: Stacked, ingredients first in collapsible section
- Step-by-step with large numbers (circular badges, 3rem)
- Video embed: 16:9 responsive iframe, rounded corners, shadow

### Navigation
- Sticky top nav: bg-white/surface with subtle shadow
- Logo left, main nav center, "Resep Tersimpan" right
- Mobile: Hamburger menu with large touch targets (min-h-14 for each link)
- Breadcrumbs on recipe detail pages

### Buttons
- Primary (CTAs): bg-teal, text-white, h-12 md:h-14, rounded-lg, font-semibold
- Secondary: bg-white border-2 border-teal, text-teal
- Outline on images: backdrop-blur-md bg-white/20 border-2 border-white
- All buttons: min-w-32, px-8, no custom hover states (use defaults)

### Tags & Badges
- Age tags: rounded-full, bg-blue-100 text-blue-700, px-4 py-2
- Nutrition badges: rounded-md, bg-green-50 text-green-800, with emoji/icon prefix
- Time badges: rounded-md, bg-amber-50 text-amber-700

---

## Animations
**Minimal & Purposeful**:
- Card hover: Subtle lift (translate-y-1) and shadow increase
- Button interactions: Native Tailwind hover/active states only
- Page transitions: Simple fade-in for recipe results
- NO scroll-triggered animations, NO complex transitions

---

## Images

### Hero Section Image
- **Type**: Soft, warm illustrated hero image (not photo)
- **Content**: Cheerful illustration of fresh vegetables, grains, baby bowl, wooden spoon in pastel colors
- **Style**: Flat illustration with rounded shapes, friendly and approachable
- **Placement**: Full-width banner, 300-400px height
- **Treatment**: Overlay with semi-transparent sage green gradient (bottom to top)

### Recipe Card Images
- **Type**: High-quality photos of finished MPASI dishes
- **Style**: Natural lighting, overhead/45-degree angle, clean white bowl/plate
- **Aspect Ratio**: 16:9 consistently
- **Fallback**: Soft gradient placeholder with vegetable icon if no image

### Iconography
- **Source**: Heroicons (outline style for navigation, solid for in-context icons)
- **Usage**: Cooking time, age ranges, nutritional benefits, utensils
- **Size**: w-6 h-6 for inline, w-8 h-8 for standalone

---

## Accessibility & Localization

- All interactive elements minimum 44x44px touch targets
- Form inputs with visible labels and helpful placeholder text in Indonesian
- High contrast ratios (WCAG AA minimum): 4.5:1 for body text
- Error states: Red border + icon + descriptive Indonesian text below input
- Success states: Green checkmark + confirmation message
- Loading states: Skeleton screens with animated pulse for recipe cards
- Educational disclaimers: Soft info boxes (bg-blue-50) with IDAI/Kemenkes logos, text-sm
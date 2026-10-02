# [MARCA] Brand Design System (for Remotion)

Drop-in design tokens for [MARCA]-branded motion graphics videos.
Copy `Theme.ts` into any Remotion project.

## Theme.ts

```ts
export const COLORS = {
  DeepForest: '#224131',
  [MARCA]Purple: '#5E3987',
  SoftBone: '#F9F8F6',
  WarmSand: '#E8E0D4',
  Anthracite: '#2B2B2B',
  LucidViolet: '#9078C8',
  SageGlass: '#88A088',
};

export const FONT = {
  display: '"Space Grotesk", sans-serif',
  body: '"Inter", sans-serif',
  weights: {
    light: 300, regular: 400, medium: 500,
    semibold: 600, bold: 700, extrabold: 800, black: 900,
  },
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
};
```

## Visual Rules

| Rule | Value |
|------|-------|
| Primary bg | `COLORS.Anthracite` (#2B2B2B) |
| Secondary bg | `COLORS.DeepForest` (#224131) |
| Surface/cards | `COLORS.SoftBone` at 3-5% opacity on main bg |
| Borders | `COLORS.SoftBone` at 10-15% opacity |
| Text primary | `COLORS.SoftBone` (#F9F8F6) |
| Text secondary | `COLORS.WarmSand` (#E8E0D4) |
| Accent primary | `COLORS.[MARCA]Purple` (#5E3987) |
| Accent secondary | `COLORS.LucidViolet` (#9078C8) |
| Accent tertiary | `COLORS.SageGlass` (#88A088) |
| Radius (cards) | 12px |
| Radius (small) | 8px |
| Radius (containers) | 16px |
| Shadow (cards) | `0 24px 80px rgba(0,0,0,0.4)` |

## Motion Posture

- **Spring:** `{ damping: 14, stiffness: 120 }` for entries
- **Spring (cards):** `{ damping: 18, stiffness: 100 }` — softer
- **Posterize:** `Math.floor(frame / 2) * 2` for stepped text animation
- **Ken Burns:** 1→1.08 zoom over scene duration with ±10px drift
- **Transitions:** fade at 0.3s (10 frames at 30fps), no wipes

## Grid / Layout Constants

- **JKL sidebar** — 48px from left, vertical center
- **Card grid** — 130px from left, 90px from top, 16px gap
- **Card size** — 260px wide, auto height, 20px padding
- **Category pills** — 12px font, 6px 14px padding, 20px radius
- **Bottom bar** — 16px 48px padding, 1px top border at 10% opacity

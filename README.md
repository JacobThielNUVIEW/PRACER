# REACELAY – Adaptive running platform

## Color tokens and linting

This project centralizes UI color tokens under `src/styles/tokens`. Use `npm run check:colors` to scan for inline color literals or legacy Tailwind classes across the codebase — the script will exit non-zero if it finds a match that should be tokenized. Prefer using the CSS variables in `src/styles/tokens/colors.css` or the `cssVar()` helper in `src/styles/tokens/colors.ts` when adding colors.


### <PartnerLogo />

Usage:
```tsx
// resolve via brand mapping defined in src/lib/constants.ts
<PartnerLogo brand="strava" size={28} className="opacity-90" />

// explicit source
<PartnerLogo src="/assets/images/strava-logo.webp" size={36} />
```

Props:
- brand: "strava" | (other keys from `IMAGES.logos`)
- src: string (optional) — explicit image path overrides `brand`
- size: number | string (px or CSS value)
- className: string (optional)

Additional props:
- dark: boolean — when true, PartnerLogo prefers the `<brand>Dark` asset if present.
- invert: boolean — when true, applies a CSS invert filter (useful if no dark asset exists).

Notes:
- `size` can be a number (px) or a css size like `"100%"` when used as a background.
- `PartnerLogo` uses Next.js `Image` under the hood; add external domains to `next.config.js` if needed.

# Color tokens

This folder contains your project's color token definitions and helper exports.

Files:
- `colors.example.json` — Example JSON schema file. Paste your finalized color tokens here.
- `colors.ts` — Exports tokens as TypeScript constants for import in the codebase.
- `colors.css` — CSS variables you can import in `globals.css` to use tokens in CSS.

Guidance:
- Keep `colors.example.json` as source-of-truth for your token values, then update `colors.ts` when you change tokens.
- Avoid committing real secrets or user data in this folder.
- Prefer not to hard-code colors in components; import from `colors.ts` or use CSS variables.

How to use in a component (JS/TSX):

```ts
import colors from '@/styles/tokens/colors';

export function Btn() {
  return <button style={{ background: colors.primary }}>Click</button>;
}
```

How to use in CSS:

```css
/* In your globals.css */
@import './styles/tokens/colors.css';

.btn { background: var(--color-primary); }
```

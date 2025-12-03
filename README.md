# NeverStop – Adaptive running platform

## Color tokens and linting

This project centralizes UI color tokens under `src/styles/tokens`. Use `npm run check:colors` to scan for inline color literals or legacy Tailwind classes (like `bg-gold` or `bg-[#...`) across the codebase — the script will exit non-zero if it finds a match that should be tokenized.

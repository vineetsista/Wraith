# Contributing to Wraith

Thanks for thinking about contributing — Wraith is a personal project, but PRs that fix bugs, polish the UX, or add a new demo-grade feature are welcome.

## Quick start

```bash
git clone https://github.com/vineetsista/Wraith.git
cd Wraith
npm install
npm run dev
# → http://localhost:3000
# → sign in as vineet.sista@gmail.com (any password) to see the admin demo
```

## Before you open a PR

Run these locally:

```bash
npx tsc --noEmit        # type check
npm run build           # production build
```

Both must pass. CI runs the same two checks on every push.

## Bar for accepted changes

- **Bug fixes** — always welcome. Include repro steps.
- **UX polish** — welcome if the result feels at home in the existing design language (true-black canvas, mono numbers, ambient green glow, no rounded-corner muzak).
- **New features** — open an issue first so we can talk about whether it fits the demo. Features that require new external services (auth providers, paid APIs, etc.) generally don't.
- **Refactors** — only if they make a concrete bug less likely or simplify reading the code. No churn for its own sake.

## Code style

- Default to **no comments**. Let names do the work.
- All financial numbers in `JetBrains Mono` (`.font-mono` or `<span className="num">`). Profit always `text-signal` (#00FF88).
- Keep `src/lib/wraith-context.tsx` small and obvious — it's the single source of truth for auth/demo/admin state.
- Reuse the design tokens in `tailwind.config.ts` instead of hardcoding colors.

## Reporting bugs

Open an issue with the [bug template](https://github.com/vineetsista/Wraith/issues/new?template=bug_report.yml). Include browser, OS, Node version, and a screen recording if the bug is visual.

## Security

See [SECURITY.md](SECURITY.md).

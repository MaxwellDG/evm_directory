# EVM Directory

A web front end for browsing on-chain projects by category: smart contracts, dapps, developer tools, gaming, informational resources, and wallets. It is an early work in progress; most screens are placeholders and no live data is loaded yet.

## What's in the app

### Landing page (`src/screens/index.tsx`)

A tall scrolling page with a large rotating EVM/Ethereum logo graphic (`src/assets/svgs/evm-logo.tsx`): an Ethereum diamond surrounded by six clickable category nodes. As you scroll, the highlighted category rotates through Contracts, Dev Tools, Wallets, Gaming, Dapps, and Informational, and a summary box describes the current one. Clicking a category plays an expanding-circle transition and then navigates to that category's route.

### Directory and category screens (`src/screens/`)

| Screen | Path | Status |
| --- | --- | --- |
| Directory | `/directory` | Layout wrapper that renders the selected category via `<Outlet />` |
| Contracts | `/directory/contracts` | In progress (see below) |
| Dapps, Dev Tools, Gaming, Informational, Wallets | `/directory/<category>` | Empty placeholder components; not yet registered in the router |

Routes are defined in `src/routing/routes.tsx` and wired up in `src/routing/index.tsx`. Only the root page and `/directory/contracts` are currently registered.

### Contracts screen (`src/screens/contracts/`, `src/components/contracts/`)

- **Filters** (`contractFilters`): contract type select (law, medicine, gaming, defi, gambling, crowdfunding), an "Is Known" toggle, a sort select (newest / oldest), and a search input.
- **Contract list** (`contractList`): list of contracts with avatar and hash ID, plus a paginator (`src/components/ui/paginator`) driven by the filters' `page` value.
- **Contract info** (`contractInfo`): shown when a contract is selected, with an owner header (`owner`) and tabs (`src/components/ui/tabs`) for **Overview** (`overview`) and **Methods** (`methods`, an accordion list of contract methods).

The contract list starts empty and the info panels are placeholders: the data-fetching hooks are still `todo`s.

## Data source

The contracts screen loads Sepolia escrow deals from [evm_directory_api](https://github.com/MaxwellDG/evm_directory_api) (`escrows` / `escrow` GraphQL queries). Set `VITE_API_URL` (see `.env.example`) to the running API, e.g. `http://localhost:4000/`. Rows are mapped into the existing contract list/detail UI; type filters other than DeFi currently return no rows because the API is escrow-only.

## Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite 7](https://vite.dev/) with `@vitejs/plugin-react`
- [Chakra UI v3](https://chakra-ui.com/) (with Emotion and `next-themes` for color mode)
- [React Router 7](https://reactrouter.com/) (`react-router-dom`)
- [Framer Motion](https://motion.dev/), [React Icons](https://react-icons.github.io/react-icons/), Sass
- [Sentry](https://docs.sentry.io/platforms/javascript/guides/react/) router instrumentation (`@sentry/react`)

## Getting started

Requires Node.js (a version supported by Vite 7, i.e. 20.19+ or 22.12+) and [pnpm](https://pnpm.io/) (a `pnpm-lock.yaml` is committed).

```bash
pnpm install       # install dependencies
pnpm dev           # start the Vite dev server with HMR
pnpm build         # type-check (tsc -b) and build to dist/
pnpm preview       # serve the production build locally
```

`pnpm lint` runs `eslint .`, but no ESLint config file is committed yet, so it will fail until one is added.

## Project structure

```
src/
  assets/svgs/          EVM logo graphic used on the landing page
  components/
    contracts/          contract filters, list, and info (overview, owner, methods)
    ui/                 shared UI: paginator, tabs, select, summary box, Chakra provider, etc.
  hooks/                useWindowDimensions
  routing/              route constants, router, and app root
  screens/              landing page and directory/category screens
  styles/, theme/       global styles, fonts, text styles, breakpoints
```

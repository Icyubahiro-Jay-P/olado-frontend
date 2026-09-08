# OLADO — Frontend

OLADO is a demo multi-vendor e-commerce marketplace. This package is the customer-, seller- and admin-facing web app: a React (Vite) single-page application styled with Tailwind CSS v4, backed by a REST API (see `../backend`).

## Tech stack

- **React 19** (function components + hooks) with **React Router 7** for routing
- **Vite** for dev server / build
- **Tailwind CSS v4** — tokens defined via `@theme` in `src/index.css` (no `tailwind.config.js`)
- **Zustand** for state (auth, cart, wishlist, theme, currency) — plain stores with manual `localStorage` read/write, no middleware
- **Axios** for API calls, with a shared instance + bearer-token interceptor (`src/api/axios.js`)
- **lucide-react** for icons, **framer-motion** for light motion, **react-hot-toast** for toasts

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL if your backend runs elsewhere
npm run dev
```

Other scripts: `npm run build` (production build), `npm run preview` (preview the build), `npm run lint` (ESLint).

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend REST API | `http://localhost:5000/api` |

## Routes

| Path | Description | Access |
|---|---|---|
| `/` | Home — hero, categories, featured shops, featured products | Public |
| `/products` | Product catalogue with search/category/shop/price filters | Public |
| `/products/:id` | Product detail, reviews | Public |
| `/cart` | Shopping cart | Public |
| `/wishlist` | Saved products | Public |
| `/checkout` | Multi-step checkout (shipping → live shipping quote → payment → confirmation) | Public (login required to place the order) |
| `/login`, `/register` | Auth — register supports Customer/Seller | Public |
| `/profile` | Order history, currency preference, Become a Seller prompt | Logged in |
| `/become-seller` | Open a shop and upgrade to a seller account | Logged in, customer role only |
| `/seller/dashboard` | Seller dashboard — overview, products, orders, shop profile | Logged in, seller role only |
| `/shops/:id` | Public shop storefront page | Public |
| `/team` | Meet the (fictional, demo) OLADO team | Public |
| `/admin` | Admin dashboard — products, orders, sellers, categories, commission, reviews | Logged in, admin role only |
| `/faq`, `/about` | Static info pages | Public |

## Demo-resilience: offline fallback pattern

Every page that talks to the backend follows the same rule: **the UI must never break if the backend is unreachable.** Every API call is wrapped so that on failure it falls back to client-side demo data or a simulated success (see `src/utils/demoProducts.js` for the offline product/shop dataset, and the `.catch(...)` on essentially every `api.*` call across `src/pages/*`). Mutations that sync to the account (cart/wishlist sync, `hydrateFromAccount`) are fire-and-forget and silently no-op on failure — they never block the UI or throw.

This means the whole app — browsing, cart, wishlist, checkout, seller dashboard, admin — is fully clickable and demoable even with `backend/` not running.

## Multi-currency

Prices are authored in USD and displayed via `useCurrencyStore`'s `format()` helper, which converts to RWF using a fixed demo rate (1300 RWF/USD, matching the backend's hardcoded rate) when the shopper switches currency from the navbar or their profile.

## Demo accounts

- Customer: `demo@olado.com` / `demo123`
- Admin: `admin@olado.com` / `admin123`
- Seller: register a new account and choose the "Seller" option, or upgrade an existing customer account from `/become-seller`.

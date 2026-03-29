# Mediflow Medicine Tracking Platform

This workspace now contains a production-built medicine tracking platform split into:

- `docs-web/`: dedicated system overview and documentation website deployed at the root Pages path
- `mobile-app/`: mobile-first user app built for `/app/`
- `admin-web/`: admin dashboard built for `/admin/`
- `convex/`: shared backend schema, queries, mutations, and HTTP actions
- `shared/`: design tokens, UI primitives, adapters, selectors, utilities, and shared state wiring

The UI direction follows the Figma language closely: soft white surfaces, rounded wellness cards, lime progress accents, calm spacing, and mobile-first health dashboard patterns instead of a generic template.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Convex client
- Zod
- React Hook Form
- Recharts
- Lucide icons
- XLSX / SheetJS
- `@zxing/browser` barcode scanning

## Implemented Areas

### Mobile app

- Mock phone OTP sign-in flow
- Placeholder Zalo connect hook
- Profile setup with name, height, blood type, and device sync toggle
- Home dashboard
- Medicine list and detail views
- Daily water, sleep, and activity logging
- Meal scan flow with mock AI analyzer interface
- Product barcode scanning and lookup
- Daily and weekly status charts
- Notifications center

### Admin web

- Overview dashboard
- Product search and manual product entry
- Barcode-assisted product entry
- Excel import flow
- Reminder management
- Follow-up rule builder
- Direct messaging UI with delivery states

### Backend

- Convex schema covering:
  - `users`
  - `profiles`
  - `medicines`
  - `medicineLogs`
  - `reminders`
  - `dailyLogs`
  - `waterLogs`
  - `sleepLogs`
  - `activities`
  - `nutritionEntries`
  - `scannedMeals`
  - `products`
  - `barcodeScans`
  - `avoidItems`
  - `adminNotes`
  - `followUpRules`
  - `healthCheckResults`
  - `notifications`
  - `directMessages`
  - `messageDeliveries`
- Demo seed data
- Dashboard snapshot queries
- Mobile/admin mutations
- Placeholder Convex HTTP actions for health, meal-analysis, and message-preview

## Environment Variables

Create these files:

- `mobile-app/.env`
- `admin-web/.env`

Use the same values in both:

```env
VITE_CONVEX_URL=https://moonlit-retriever-161.convex.cloud
VITE_CONVEX_HTTP_URL=https://moonlit-retriever-161.convex.site
```

Example files are included as:

- `mobile-app/.env.example`
- `admin-web/.env.example`

## Local Setup

From the workspace root:

```bash
npm install
```

Run the apps:

```bash
npm run dev -w docs-web
npm run dev -w mobile-app
npm run dev -w admin-web
```

Production builds:

```bash
npm run build
```

Or individually:

```bash
npm run build -w docs-web
npm run build:mobile
npm run build:admin
```

## Convex Setup

The backend code is fully written locally, but this environment did not have Convex deployment credentials, so the real `convex/_generated/*` files could not be pulled from the existing project.

Current state:

- `convex/` contains the real schema and functions
- `convex/_generated/` contains compile-time stubs so the apps can build locally
- both apps already point at the provided Convex URLs

Remaining step to finish the real backend binding:

1. From the repo root, log in to Convex:

```bash
npx convex login
```

2. Configure this repo against the existing Convex project and regenerate real generated files:

```bash
npx convex dev --once --configure existing
```

3. In the interactive prompt, choose the existing project/deployment that corresponds to:

- `https://moonlit-retriever-161.convex.cloud`
- `https://moonlit-retriever-161.convex.site`

4. After that succeeds, the CLI will replace the stubbed `convex/_generated/*` files with real generated types.

5. When you are ready to push backend changes to production:

```bash
npx convex deploy
```

Notes:

- Opening either app will call `seed.ensureDemoData`, so the demo dataset will populate automatically once the backend is connected.
- If you want a clean production dataset, adjust or remove the seed behavior before final launch.

## cPanel Upload

The apps are already configured with the correct Vite bases and SPA fallback rules:

- `mobile-app` base: `/app/`
- `admin-web` base: `/admin/`
- `.htaccess` files are copied into both build outputs

Build outputs:

- `mobile-app/dist/`
- `admin-web/dist/`

Upload targets in cPanel:

1. Upload the contents of `mobile-app/dist/` into `public_html/app/`
2. Upload the contents of `admin-web/dist/` into `public_html/admin/`

Do not upload the parent `dist` folder itself unless you want nested paths; upload its contents.

## Verified Build Outputs

These commands completed successfully from the root workspace:

```bash
npm run build -w mobile-app
npm run build -w admin-web
```

The final outputs include:

- `mobile-app/dist/.htaccess`
- `admin-web/dist/.htaccess`

## GitHub Pages

This repo also supports GitHub Pages deployment through GitHub Actions.

Expected public paths:

- docs site: `/medicine_app/`
- mobile app: `/medicine_app/app/`
- admin app: `/medicine_app/admin/`

Workflow file:

- `.github/workflows/deploy-pages.yml`

The workflow builds both Vite apps with a GitHub Pages base prefix, assembles them into one Pages artifact, and publishes them through the official Pages deploy action.

To finish enabling it in GitHub:

1. Open the repo settings
2. Go to `Pages`
3. Set the source to `GitHub Actions`
4. Merge the PR with the workflow into `main`
5. Run the workflow or push to `main`

The workflow currently injects:

- `VITE_CONVEX_URL=https://moonlit-retriever-161.convex.cloud`
- `VITE_CONVEX_HTTP_URL=https://moonlit-retriever-161.convex.site`

These values are public client-side endpoints, so they can be used directly in the Pages build.

## Integration Placeholders

These are implemented behind clean adapter boundaries and can be swapped later without major UI refactors:

- Phone OTP: mock flow only, no real SMS provider configured
- Zalo integration: placeholder connect hook, no real OAuth or delivery setup
- Smartwatch / Apple Watch sync: mock adapter only
- AI calorie scanning: mock analyzer interface with clear replacement point for a real multimodal service

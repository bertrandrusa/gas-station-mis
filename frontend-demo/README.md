# StationFlow — public frontend demo

A responsive, static demonstration of the Gas Station MIS with fictional stations, cash figures, staff, approvals, reports, and alerts.

The login is a **simulation**, NOT an authentication service. Anyone can log in with the sample accounts shown on the page. Nothing is sent to the Frappe backend, no password is stored, and changes reset on refresh. DO NOT enter genuine credentials or business data.

## Run locally

From the repository root, use:

    python3 -m http.server --directory frontend-demo 8080

Open http://localhost:8080.

## Hosting

The GitHub Actions workflow publishes only this folder with GitHub Pages. Go to Settings > Pages > Build and deployment > Source: GitHub Actions. Then run the 'Publish public MIS demo' workflow if needed.

The expected URL after deployment is https://bertrandrusa.github.io/gas-station-mis/ (not live until Pages deployment succeeds).

## Production boundaries

This demo is NOT the actual ERPNext system. Role permissions and sign-in are simulated entirely in the browser, not secure. The actual Frappe app lives in the gas_station_mis directory. Real authentication, employee records, transaction data, authorization and database access MUST remain on a secured backend.

## Fictional demonstration team

The sample station team and report authors use the names of Manchester City footballers for fun. These are **fictional staff assignments**: no real player works at these stations, and this demo is not affiliated with or endorsed by Manchester City FC. No real employee or footballer information is collected.

## Selected frontend — Appsmith ADS-inspired components

StationDesk is an independent static HTML/CSS/JavaScript demonstration inspired by the **Appsmith Design System (ADS)**. It is not built with Appsmith, does not import their component library, and is not affiliated with or endorsed by Appsmith. Sample sign-in and all data are simulated.

The UI follows the documented ADS conventions, including:

- System typography (SF Pro / Segoe UI / Ubuntu according to operating system, with PT Root UI only if already installed) and 12–14px application text
- Base spacing scale of 2, 4, 8, 12, 16, 20 and 24px
- 36px medium and 24px small buttons; primary / secondary / tertiary treatments, 6px rounding
- 36px medium input and select controls with readable labels, focus outlines and neutral borders
- Professional white and slate-gray workspace surfaces with custom corporate blue (`#2563eb`) primary actions, navy header, and green / amber / red reserved for statuses
- Unified line icons (locally rendered SVG), navigation, tables, filters, inputs, dialogs and toast notifications
- Sample CSV export and search for daily reports; simulated reports/approvals/team/alerts

The site uses `styles.css` for structural layout and `workspace.css` for the full ADS-inspired visual system.

Official public design-system references:
- https://github.com/appsmithorg/design-system/blob/release/packages/design-system/src/Documentation/Typography.mdx
- https://github.com/appsmithorg/design-system/blob/release/packages/design-system/src/Button/Button.styles.tsx
- https://github.com/appsmithorg/design-system/blob/release/packages/design-system/src/Input/Input.styles.tsx
- https://github.com/appsmithorg/design-system/blob/release/packages/design-system/src/__theme__/default/colors.css

Appsmith's newer typography theme imports PT Root UI, but this demo **does not bundle or redistribute font files**; it uses a resilient system-font fallback.

## Corporate color palette

The live StationDesk demo uses a custom **blue and white** business theme while preserving the ADS-inspired component sizes, spacing and fonts. Blue is intentionally different from Appsmith's own orange brand color.

- Primary buttons, active navigation and links: `#2563eb` (hover `#1d4ed8`)
- Workspace header: `#142b49` navy
- Page background: `#f4f7fb`, cards / input fields: white
- Report status colors: green (approved), amber (pending), red (returned / danger)

Only presentation changed; sample users, data, roles, reports and the API-disconnected demo remain as before.

## Selected login page — premium station portal with the uploaded Lottie animation

The public login page follows **Option C: Premium Station Portal** and now uses the exact artwork and keyframes from the user's uploaded `fuel-pump.json`. It shows an original vector forecourt background, navy overlay, and floating white demo sign-in card.

- **Real asset:** `fuel-pump-original.json` is a byte-for-byte copy of the supplied animation (`Gas_station_Final_Comp`, 1920×1080, 25 frames/second, 150 frames, 6 seconds). It is not the former placeholder pump.
- **Playback asset:** `fuel-pump-lottie.json` retains its visual paths, precompositions, timing and animation keyframes. For safer embedded playback, 86 After Effects expression-script snippets were removed; their default colors/values are retained. This avoids running arbitrary expressions received in uploaded content.
- **Lottie renderer:** pinned official `lottie-web` **full** player v5.12.2 (`vendor/lottie.min.js`, MIT license in `vendor/LOTTIE_LICENSE.md`). The full renderer is necessary for the uploaded asset's track mattes and masks; the former lightweight player was removed.
- **Interaction:** the uploaded six-second fuel-pump animation is the **only animated element on the login screen**. It appears alone at a large size (up to 390px wide on desktop, responsive on mobile), runs once on load, and can be replayed by hovering, clicking or tapping. No percentage gauge, progress bar, extra cards, decorative effects or looping animations.
- **Accessibility:** supports touch, keyboard and mouse; `prefers-reduced-motion` moves directly to the final frame rather than playing motion.
- **Privacy:** the Lottie player and JSON are hosted locally alongside the static demo. No third-party scripts or network calls for animation are needed.
- **Scope:** public demo accounts, password toggle, reports, approvals and team names are unchanged. This is not real authentication or an ERPNext integration.

The uploaded file's original creator/license should be respected when redistributing the animation. The user provided the asset for use in this project.

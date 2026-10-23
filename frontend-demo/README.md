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

## Selected login page — premium station portal with fuel-pump interaction

The public landing/login page now follows **Option C: Premium Station Portal** from the design review. It shows an original vector forecourt illustration, navy photographic-style overlay, a floating white sign-in card, and an interactive fuel-pump graphic on the left.

- Click or tap the **Animated fuel pump (Lottie)** control to play a native Lottie JSON fuel-pump animation and simulate an 18% → 86% tank fill; tap again to reset. Hover previews the opening frames on pointer devices. **This is visual-only**, not connected to real pumps, database, POS, or ERPNext service.
- The animation uses a locally served `fuel-pump-lottie.json` and the genuine `lottie-web` light renderer, pinned to v5.12.2 (`vendor/lottie-light.min.js`, MIT license at `vendor/LOTTIE_LICENSE.md`). All runtime assets are served from the same domain; no outside JavaScript service or third-party requests.
- **Source distinction:** this is an original StationDesk fuel-pump animation encoded as genuine Lottie JSON, **not** the specific community-authored Fuel Pump animation by ShriyamDalal on LottieFiles. That particular asset's downloadable file was not retrievable through the available services. To replace it with that exact artwork, obtain its Lottie JSON from [LottieFiles](https://lottiefiles.com/free-animation/fuel-pump-paFVEnDJKN) and replace the local `fuel-pump-lottie.json` after testing compatibility.
- All animation is user-triggered. `prefers-reduced-motion` displays the final visual without playing motion.
- The **Show / Hide** password toggle, Manager and Employee demo accounts, dashboards, approvals and reports remain unchanged.
- The background uses original `forecourt-scene.svg` and the premium portal styles live in `login-portal.css`.
- The public demo login is not actual authentication; real access must be provided by a secured Frappe backend.

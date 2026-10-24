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

## StationDesk design — Taste-inspired forecourt ledger

StationDesk has its own visual identity, replacing the earlier Appsmith-style look. The redesign was **informed by** the practical app-screen rules in [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), especially quiet data surfaces, precise type hierarchy, meaningful action placement, honest figures and a phone-friendly work area. It is an original StationDesk adaptation, not an installation or automated browser-verified execution of Taste Skill.

The visual direction takes its palette from the station forecourt: deep petrol green, paper-like ivory, restrained green data emphasis and warm amber for attention. The design system lives in `taste-redesign.css`, loaded after the existing structural and mobile styles, so existing reporting, approval, demo accounts and mobile interactions continue to work.

- Bespoke station pump mark, dark petrol sidebar, warm light workspace, responsive typography and calmer data tables.
- An **action-first shift handover** strip derived from existing pending reports and open alerts, with a working review or new-report button.
- Clear RWF figures and role-specific actions, with statuses coloured only where they carry meaning.
- Floating mobile navigation, responsive report cards, usable form fields and safe-area spacing.
- The existing uploaded fuel-pump Lottie remains the only animated login artwork; its keyframes are unchanged.

The former Appsmith-inspired `workspace.css` and typography remain as compatibility/base layers but are intentionally visually overridden by `taste-redesign.css`. The demo is still not an Appsmith app and no Appsmith components or brands are embedded.

## StationDesk login — forecourt editorial layout with the uploaded Lottie animation

The login presents a bespoke dark-petrol welcome with a warm paper sign-in form and keeps the exact artwork and keyframes from the user's uploaded `fuel-pump.json`.

- **Real asset:** `fuel-pump-original.json` is a byte-for-byte copy of the supplied animation (`Gas_station_Final_Comp`, 1920×1080, 25 frames/second, 150 frames, 6 seconds). It is not the former placeholder pump.
- **Playback asset:** `fuel-pump-lottie.json` retains its visual paths, precompositions, timing and animation keyframes. For safer embedded playback, 86 After Effects expression-script snippets were removed; their default colors/values are retained. This avoids running arbitrary expressions received in uploaded content.
- **Lottie renderer:** pinned official `lottie-web` **full** player v5.12.2 (`vendor/lottie.min.js`, MIT license in `vendor/LOTTIE_LICENSE.md`). The full renderer is necessary for the uploaded asset's track mattes and masks; the former lightweight player was removed.
- **Playback:** the uploaded six-second fuel-pump Lottie is the **only animated element on the login screen**. It starts automatically when the page opens and repeats continuously, without hover, click, tap, or extra controls. The original animation is shown at up to 420px wide on desktop (responsive on mobile), with no percentage gauge, progress bar, extra cards or other animations.
- **Accessibility:** there is nothing to click or tap to activate the illustration. The `prefers-reduced-motion` preference freezes it at its final frame.
- **Privacy:** the Lottie player and JSON are hosted locally alongside the static demo. No third-party scripts or network calls for animation are needed.
- **Scope:** public demo accounts, password toggle, reports, approvals and team names are unchanged. This is not real authentication or an ERPNext integration.

The uploaded file's original creator/license should be respected when redistributing the animation. The user provided the asset for use in this project.

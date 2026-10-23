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

## Selected frontend design — Appsmith-inspired workspace

The only published frontend is a standalone **StationDesk** demo, visually inspired by the light canvas, widgets, navigation and tables common in Appsmith-built internal tools. It does **not use Appsmith's platform** and is not affiliated with Appsmith.

- Purple page navigation, charcoal app bar and orange primary actions
- Dashboard stat, chart and alert widgets, compact table views
- Search and CSV export in Daily reports (fictional records only)
- Simulated Manager / Employee login and existing demo workflows
- Styles in `workspace.css`, source interactions in `app.js`, shared pure calculations in `core.js`

The main `index.html` loads `styles.css` then `workspace.css`. Only one design is shipped.

# Enköpings blåsorkester

En statisk Vue 3-hemsida. Vue hämtas från CDN och webbplatsen kräver ingen npm-installation, byggprocess eller server för att publiceras.

## Sidstruktur

`index.html` innehåller dokumentets skal. Sidlayouten finns i `src/layout.html`, medan sektionerna Om oss och Nyheter ligger i `src/about.html` respektive `src/news.html`.

## Nyheter

Varje nyhet är en JSON-fil i `news/`. Kopiera `news/2026-10-23-valkommen.json`, ändra datum, rubrik, sammanfattning och brödtext, och lägg till filnamnet i `news/index.json`. Datum skrivs som `ÅÅÅÅ-MM-DD`; `body` är en lista med stycken.

## GitHub Pages

Arbetsflödet i `.github/workflows/pages.yml` publicerar webbplatsen automatiskt vid push till `main`. Välj **Settings → Pages → Build and deployment → GitHub Actions** i GitHub-repot. När arbetsflödet har körts finns sidans adress under Actions eller Settings → Pages.

Webbplatsen kan också öppnas lokalt genom att servera repots rotmapp med valfri statisk filserver.
software
Deal: collage hero; Outfit 400/500/600, served locally from the app font files; client palette ink/bone/magenta/mint; nav-centre; footer-columns; close-word; space; solid buttons; round radius. Client brand SVGs reused with theme-appropriate variants. Ground sky mapped to the client's bone neutrals. Native H.264 video in the hero, with media-event-based play/pause; liquid-type on the details headline. No scene. Hero cursor-spotlight omitted to keep a single beat in the hero.

## Brief

Seratina is a mobile app for discovering nightlife and events. Audience: people looking for nearby clubs, concerts, festivals and evenings out. Primary action: Prova Seratina, linking to the existing beta onboarding. Real material: logo, four app screenshots, existing copy and product capabilities. Preserve newsletter, location selection, event deep links and all existing destinations. Implementation and visual checks performed locally; Git delivery is handled separately on a branch from main.

## Critical design points

- The six identical feature cards flatten the hierarchy and add a long mobile scroll.
- Glow, gradients, floating badges and numerous rounded wrappers compete with the app.
- Repeated beta links lack a clear primary action.
- The screenshot gallery does not explain the relationship between discovery, details and planning.
- Navigation loses its links on mobile.
- The old palette has no light counterpart.

## Screens

1. top / hero: category, product and beta action; current app screens in an eight-second silent video; object; 1 screen at all widths; native video and poster fallback.
2. anteprima / app-frame: real events and map captures, with manual accessible tabs and responsive desktop/phone sources; object; 1 screen. No simulated bookmark actions or old Halloween UI.
3. funzionalita / details: details and calendar, with complete current phone viewport captures; object/parts; 1 screen, 2 on phones; liquid-type on the inverse ink/bone ground.
4. newsletter / form: city-based weekly newsletter, existing optional GPS flow; form/type; 1 screen, including phones.
5. contact / footer: beta close, large Seratina wordmark and existing site links; type; 1 screen.

## Copy

H1: L’app per le serate vicino a te.
Hero lead: Club, concerti e festival su una sola mappa. Trova gli eventi intorno a te, salva i preferiti e organizza il weekend.
Hero fact: Beta gratuita su iOS e Android.
Main action: Prova Seratina.
Section headings: Gli eventi, prima di uscire. / I dettagli fanno la serata. / Le serate del weekend, ogni giovedì. / La tua prossima serata.

## Scope decisions

The existing event modal and newsletter city/GPS fields remain because they are established product flows. The skill's generic email-only newsletter and no-popup scaffold do not justify removing those flows. Existing real contact links are retained. Security and backend changes listed in ANALISI.md remain deferred. No invented testimonials, metrics, prices, addresses or photographs. No replacement photography is required; all visual product content comes from the repository.

## Delivery assets

The working copy of the kit is reduced to the runtime modules this page uses. Original skill files and original product captures are unchanged. Resized WebP delivery variants are in `assets/optimized`. A footer appearance control follows the system preference by default and permits an explicit light/dark choice.

## Motion refinement

The original iris-opens deal was replaced after the performance probe traced layout-shift entries to its decorative ring. Its skill files were not edited. The constrained replacement deal returned liquid-type: a low-strength pointer response on the details heading, with plain type on touch and under reduced motion. It paints without changing layout.

## Current app update — 6 November 2026

Source: the read-only running app in the sibling Seratina repository, captured at localhost:8090. Events and map: 1440×900 and 390×844; event detail and calendar: 390×844. Optimized WebP assets in assets/screenshots/current. An eight-second, silent, 1280×800 H.264 video crossfades the current desktop events/map views; it is a visual tour, not a recording of pointer interaction. Original video compositions and the mobile/backend repositories are not edited. Playback pauses outside the viewport, preserves manual pause, and defaults to a still poster for reduced motion. Existing newsletter and deep-link flows retained.

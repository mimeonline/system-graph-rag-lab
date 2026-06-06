# Feature: Kuratierte Hauptnavigation

## Status
`shipped`

## Datum
`2026-06-06`

## Ziel
Die Hauptnavigation des System GraphRAG Lab bleibt ruhig und vorhersehbar. Top-Level-Menüpunkte führen direkt auf Bereichsübersichten. Dropdowns enthalten nur wenige kuratierte Unterbereiche und keine vollständigen Detailseiten-Listen.

## Navigationsregel
1. Home, Demo, GraphRAG Story, Graph Essays und About sind direkte Top-Level-Links.
2. Demo verlinkt als Hauptpunkt auf die Demo-Übersicht.
3. Das Demo-Dropdown enthält nur Lernmodus und Live-Modus.
4. Detailseiten der Graph-Typen bleiben über die Demo-Übersicht, Cards und interne Links erreichbar.
5. Die mobile Navigation bleibt flach und zeigt dieselben kuratierten Unterbereiche ohne verschachtelte Menüs.

## Umsetzung
1. Die Navigationsstruktur liegt in `apps/web/src/components/organisms/siteNavigation.ts`.
2. Das Desktop-Menü nutzt ein shadcn-kompatibles Radix `NavigationMenu` unter `apps/web/src/components/ui/navigation-menu.tsx`.
3. `SiteHeader` trennt den direkten Bereichslink vom Dropdown-Trigger.
4. Sprachwechsel und bestehende Analytics-Events bleiben erhalten.

## Validierung
1. `cd apps/web && pnpm run typecheck`
2. `cd apps/web && pnpm run lint`
3. `cd apps/web && pnpm run build`
4. Desktop- und Mobile-Navigation im Browser prüfen

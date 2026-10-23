import { en } from "./catalogs/en";
import { es } from "./catalogs/es";
import type { Locale } from "./types";
import { DEFAULT_LOCALE, type LanguagePlatform } from "./types";
import { getEffectiveLocale } from "./effectiveLocale";

// Spanish defines the typed keys. Untranslated areas fall back explicitly to Spanish.
export type Catalog = {
  readonly [Area in keyof typeof es]: { readonly [Key in keyof (typeof es)[Area]]: string };
};

export type TranslationCatalog = {
  [Area in keyof Catalog]?: Partial<Catalog[Area]>;
};

const catalogs: Record<Locale, TranslationCatalog> = { es, en };

// Resolve once per locale. Untranslated areas reuse the original Spanish object.
const resolvedCatalogs = new Map<Locale, Catalog>([["es", es]]);

export function getCatalog(locale: Locale): Catalog {
  const cached = resolvedCatalogs.get(locale);
  if (cached) return cached;
  const resolved: Record<string, Readonly<Record<string, string>>> = {};
  for (const area of Object.keys(es) as (keyof Catalog)[]) {
    const translated = catalogs[locale][area];
    if (!translated) {
      resolved[area] = es[area];
      continue;
    }
    const entries: Record<string, string> = { ...es[area] };
    for (const key of Object.keys(translated)) {
      const value = (translated as Readonly<Record<string, string | undefined>>)[key];
      if (value !== undefined && value !== null) entries[key] = value;
    }
    resolved[area] = Object.freeze(entries);
  }
  const result = Object.freeze(resolved) as Catalog;
  resolvedCatalogs.set(locale, result);
  return result;
}

export function getEffectiveCatalog(
  requested: Locale = DEFAULT_LOCALE,
  platform: LanguagePlatform = "web",
): Catalog {
  return getCatalog(getEffectiveLocale(requested, platform));
}

// Optional diagnostics: fallback is explicit without warnings or UI side effects.
export function resolveTranslation<Area extends keyof Catalog>(
  locale: Locale,
  area: Area,
  key: keyof Catalog[Area],
) {
  const translated = catalogs[locale][area]?.[key];
  const usedFallback = translated === undefined || translated === null;
  return {
    value: translate(locale, area, key),
    requestedLocale: locale,
    sourceLocale: usedFallback ? DEFAULT_LOCALE : locale,
    usedFallback,
  } as const;
}

export function translate<Area extends keyof Catalog>(
  locale: Locale,
  area: Area,
  key: keyof Catalog[Area],
): string {
  return getCatalog(locale)[area][key];
}

export function createTranslator(locale: Locale) {
  return <Area extends keyof Catalog>(area: Area, key: keyof Catalog[Area]) =>
    translate(locale, area, key);
}

// Segmento de idioma preparado para v2 (inglés) sin reestructurar rutas.
// En v1 el único idioma es "es" y las URLs públicas no llevan prefijo
// (rewrite en next.config.ts).
export const locales = ["es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

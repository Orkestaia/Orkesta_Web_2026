export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orkesta-web-2026.vercel.app";

export const SITE_NAME = "Orkesta — Automatización & IA";

/** CTA único de negocio — brief §5c. Siempre en pestaña nueva. */
export const CAL_URL = "https://cal.com/aitor-colino-6sl1ai/30min";

export const CONTACT_EMAIL = "aitor@orkestaia.com";

export const LINKEDIN_URL = "https://www.linkedin.com/in/aitor-colino-426293370/";

/** La web pública actual de Orkesta, mientras este portfolio no la sustituya. */
export const WEBSITE_URL = "https://www.orkestaia.com/";

export const SERVICIO_LABELS = {
  captacion: "Captación y seguimiento",
  atencion: "Atención automatizada 24/7",
  operacion: "Operación sin tareas manuales",
  contenido: "Contenido y campañas con IA",
} as const;

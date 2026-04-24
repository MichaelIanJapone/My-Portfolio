/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: Web3Forms access key so the contact form works on static hosting (e.g. Vercel). */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  /** Optional: full origin for the contact API (e.g. https://your-api.railway.app). Defaults to same origin /api proxy. */
  readonly VITE_CONTACT_API_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

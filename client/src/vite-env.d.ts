/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base origin of the deployed backend, e.g. https://api.gurukul.app — leave unset in dev, the Vite proxy handles it. */
  readonly VITE_API_URL?: string;
  /** Force dev-only controls (model picker, "show thinking") on in a production build. */
  readonly VITE_SHOW_DEV_CONTROLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

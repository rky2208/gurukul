/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base origin of the deployed backend, e.g. https://api.gurukul.app — leave unset in dev, the Vite proxy handles it. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

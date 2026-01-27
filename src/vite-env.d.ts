/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DOMAIN: string
  readonly VITE_APP_URL: string
  readonly VITE_GITHUB_REPO: string
  readonly VITE_SHOW_GITHUB_STARS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

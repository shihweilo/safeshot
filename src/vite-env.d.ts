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

declare module 'safeshot-wasm' {
  export default function init(): Promise<void>
  export function init(): Promise<void>
  export function extract_metadata(bytes: Uint8Array): any
  export function strip_metadata(bytes: Uint8Array): Uint8Array
  export function calculate_savings(original: number, cleaned: number): any
  export function get_dimensions(bytes: Uint8Array): any
}

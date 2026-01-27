const config = {
  appDomain: import.meta.env.VITE_APP_DOMAIN || 'meta.zip',
  appUrl: import.meta.env.VITE_APP_URL || 'https://meta.zip',
  githubRepo: import.meta.env.VITE_GITHUB_REPO || 'shihweilo/metazip',
  showGithubStars: import.meta.env.VITE_SHOW_GITHUB_STARS === 'true',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
  zipThreshold: 5, // Number of files before creating a ZIP
}

export default config

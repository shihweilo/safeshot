const config = {
  appDomain: import.meta.env.VITE_APP_DOMAIN || 'safeshot.app',
  appUrl: import.meta.env.VITE_APP_URL || 'https://safeshot.app',
  githubRepo: import.meta.env.VITE_GITHUB_REPO || 'shihweilo/safeshot',
  showGithubStars: import.meta.env.VITE_SHOW_GITHUB_STARS === 'true',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@safeshot.app',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
  zipThreshold: 5, // Number of files before creating a ZIP
}

export default config

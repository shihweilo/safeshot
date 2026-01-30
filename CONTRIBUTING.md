# Contributing to Safeshot

Thanks for your interest! Here's how you can help:

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit PRs for bug fixes or features
- 🎨 Improve UI/UX
- 🌍 Add translations (future)

## Development Process

1. **Fork & Clone**
2. **Create branch**: `git checkout -b fix/bug-name` or `feature/feature-name`
3. **Make changes**: Follow existing code style
4. **Test**: Ensure everything works
5. **Commit**: Use clear commit messages
6. **Push & PR**: Describe your changes

## Code Style

- **Rust**: `cargo fmt` before committing
- **TypeScript**: ESLint + Prettier (auto-formatted)
- **React**: Functional components, hooks preferred
- **CSS**: Tailwind utility classes

## Testing

- Test with various image formats (JPEG, PNG, WebP, TIFF)
- Test batch processing (1, 5, 20 images)
- Test large files (up to 50MB)
- Test on mobile devices
- Verify metadata actually removed (check with `exiftool`)

## PR Guidelines

- Clear description of changes
- Link related issues
- Screenshots for UI changes
- Keep PRs focused (one feature/fix per PR)

## Questions?

Open an issue or discussion. We're friendly! 🙂

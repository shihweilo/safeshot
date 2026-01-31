# SafeShot

> Strip photo metadata. Privately. Instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/shihweilo/safeshot?style=social)](https://github.com/shihweilo/safeshot)

Remove sensitive EXIF data from your photos before sharing them online. Everything runs in your browser — your photos never leave your device.

## ✨ Features

- 🔒 **100% Private** — All processing happens locally in your browser
- ⚡ **Blazing Fast** — Powered by Rust WebAssembly
- 📦 **Batch Processing** — Handle multiple images at once
- 🎨 **Beautiful UI** — Clean, intuitive interface
- 📱 **Mobile Friendly** — Works perfectly on phones
- 🌙 **Dark Mode** — Easy on the eyes
- 🆓 **Open Source** — Verify the code yourself

## 🎯 Why SafeShot?

Photos contain hidden metadata that can reveal:
- 📍 Exact GPS coordinates (where you live/work)
- 📅 When the photo was taken
- 📷 Camera model and settings
- 💻 Software used to edit

**Don't accidentally dox yourself.** Strip it all before sharing.

## 🚀 Quick Start

Visit [SafeShot.app](https://safeshot.app) and drag your photos in. That's it.

## 🛠️ Tech Stack

- **Rust** — Metadata stripping via WebAssembly
- **React** — User interface
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **Vercel** — Hosting

## 🏗️ Development

### Prerequisites
- [Bun](https://bun.sh/) (or Node.js 18+)
- [Rust](https://rustup.rs/) + wasm-pack

### Setup

```bash
# Clone repository
git clone https://github.com/shihweilo/safeshot.git
cd safeshot

# Install dependencies
bun install

# Build Rust WASM module
cd rust-wasm
wasm-pack build --target web
cd ..

# Start dev server
bun dev
```

Visit http://localhost:5173

### Build for Production

```bash
bun run build
bun run preview  # Test production build locally
```

## 📁 Project Structure

```
safeshot/
├── rust-wasm/          # Rust WASM module
│   ├── src/lib.rs      # Metadata extraction & stripping
│   └── Cargo.toml
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (WASM loader, file utils)
│   └── types/          # TypeScript types
├── public/             # Static assets
└── dist/               # Production build
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with [wasm-pack](https://github.com/rustwasm/wasm-pack)
- Inspired by privacy-focused tools

## 💬 Support

- 🐛 [Report bugs](https://github.com/shihweilo/safeshot/issues)
- 💡 [Request features](https://github.com/shihweilo/safeshot/issues)
- ⭐ Star this repo if you find it useful!

---

Made with ❤️ for privacy

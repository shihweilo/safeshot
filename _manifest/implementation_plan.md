# meta.zip - Implementation Plan

Privacy-first EXIF metadata stripper running entirely in-browser using Rust WebAssembly.

## User Review Required

> [!IMPORTANT]
> **Domain Configuration**: The app will use environment variables for domain/URLs, making it easy to change `meta.zip` to any domain.

> [!NOTE]
> **HEIC Support**: Deferred to post-launch. Initial release supports JPEG, PNG, WebP, and TIFF.

---

## Additional Features

| Feature | Description |
|---------|-------------|
| **PWA Support** | Service worker for offline use after first visit |
| **Clipboard Paste** | `Ctrl+V` to paste images directly |
| **Optimized Previews** | Use `createImageBitmap()` for thumbnails |
| **Memory Cleanup** | Revoke Blob URLs, "Clear All" button |
| **No Analytics Badge** | Visible trust signal alongside Open Source |
| **Copy to Clipboard** | Copy cleaned image to clipboard (single image) |
| **Sample Test Images** | Test images with known metadata in repo |
| **Rust Benchmarks** | `--benchmark` flag for performance testing |

---

## Proposed Changes

### Project Initialization

#### [NEW] Project Root Files

| File | Purpose |
|------|---------|
| `package.json` | Bun + React + TypeScript dependencies |
| `vite.config.ts` | Vite config with WASM plugin |
| `tailwind.config.js` | Tailwind + shadcn preset |
| `tsconfig.json` | TypeScript configuration |
| `.env.example` | Environment variable template |
| `components.json` | shadcn/ui configuration |

#### [NEW] [.env.example](file:///Users/clo/Documents/_development/metazip/.env.example)
```bash
VITE_APP_DOMAIN=meta.zip
VITE_APP_URL=https://meta.zip
VITE_GITHUB_REPO=shihweilo/metazip
VITE_SHOW_GITHUB_STARS=false
```

---

### Rust WASM Module

#### [NEW] [rust-wasm/Cargo.toml](file:///Users/clo/Documents/_development/metazip/rust-wasm/Cargo.toml)

Dependencies:
- `wasm-bindgen` - JS interop
- `image` - Image processing
- `kamadak-exif` - EXIF parsing
- `serde` + `serde_json` - JSON serialization
- `console_error_panic_hook` - Better error messages

#### [NEW] [rust-wasm/src/lib.rs](file:///Users/clo/Documents/_development/metazip/rust-wasm/src/lib.rs)

Exposed functions:
```rust
#[wasm_bindgen]
pub fn extract_metadata(image_bytes: &[u8]) -> Result<JsValue, JsValue>
// Returns JSON with GPS, camera, timestamps, etc.

#[wasm_bindgen]
pub fn strip_metadata(image_bytes: &[u8], format: &str) -> Result<Vec<u8>, JsValue>
// Returns cleaned image bytes

#[wasm_bindgen]
pub fn calculate_savings(original_size: u32, cleaned_size: u32) -> JsValue
// Returns { bytes: u32, percentage: f32 }
```

---

### Frontend Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── UploadZone.tsx         # Drag-drop upload area
│   ├── ImageCard.tsx          # Result card per image
│   ├── MetadataViewer.tsx     # Before/after metadata display
│   ├── MetadataItem.tsx       # Single metadata row
│   ├── ProgressBar.tsx        # Processing progress
│   ├── ThemeToggle.tsx        # Light/dark/system
│   ├── HowItWorks.tsx         # Educational section
│   ├── Header.tsx             # App header with logo
│   └── Footer.tsx             # Links, credits
├── lib/
│   ├── wasm-loader.ts         # Load & initialize WASM
│   ├── file-utils.ts          # File handling, ZIP creation
│   ├── metadata-parser.ts     # Parse WASM metadata JSON
│   └── config.ts              # Environment config
├── workers/
│   └── image-processor.worker.ts  # Web Worker for WASM
├── hooks/
│   ├── useWasm.ts             # WASM initialization hook
│   ├── useTheme.ts            # Theme state management
│   └── useImageProcessor.ts   # Processing orchestration
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx
├── App.css
├── main.tsx
└── index.css                  # Tailwind base + custom
```

---

### Key Components

#### [NEW] [src/components/UploadZone.tsx](file:///Users/clo/Documents/_development/metazip/src/components/UploadZone.tsx)

- Large drag-and-drop area with visual feedback
- Click to open file picker
- Accepts: `.jpg`, `.jpeg`, `.png`, `.webp`, `.tiff`
- Max file size: 50MB per image
- Displays active/hover/error states

#### [NEW] [src/components/ImageCard.tsx](file:///Users/clo/Documents/_development/metazip/src/components/ImageCard.tsx)

- Thumbnail preview
- Processing status (pending/processing/done/error)
- Expandable metadata comparison
- Individual download button
- File size reduction badge

#### [NEW] [src/components/MetadataViewer.tsx](file:///Users/clo/Documents/_development/metazip/src/components/MetadataViewer.tsx)

- Tabbed view: "Before" | "After"
- Grouped metadata: Location, Camera, DateTime, Software
- Visual indicators for removed items (strikethrough)
- "No metadata found" state

#### [NEW] [src/workers/image-processor.worker.ts](file:///Users/clo/Documents/_development/metazip/src/workers/image-processor.worker.ts)

- Loads WASM in worker context
- Processes images off main thread
- Posts progress updates
- Returns cleaned bytes + metadata diff

---

### Download Logic

| Scenario | Behavior |
|----------|----------|
| 1 image | Direct download as `{original_name}_clean.{ext}` |
| 2-4 images | Individual downloads triggered sequentially |
| 5+ images | Single ZIP download via JSZip |

#### [NEW] [src/lib/file-utils.ts](file:///Users/clo/Documents/_development/metazip/src/lib/file-utils.ts)

- `downloadFile(blob, filename)` - Single file download
- `downloadAsZip(files[])` - Create ZIP using JSZip
- `formatBytes(bytes)` - Human-readable file sizes
- `getCleanFilename(original)` - Append `_clean` suffix

---

### Theme System

Using `next-themes` pattern adapted for Vite:
- Persisted in `localStorage`
- System preference detection
- Smooth transitions
- Tailwind `dark:` classes

---

### Repository Files

#### [NEW] [README.md](file:///Users/clo/Documents/_development/metazip/README.md)
Professional README with badges, features, setup instructions (per original plan)

#### [NEW] [CONTRIBUTING.md](file:///Users/clo/Documents/_development/metazip/CONTRIBUTING.md)
Contribution guidelines (per original plan)

#### [NEW] [CODE_OF_CONDUCT.md](file:///Users/clo/Documents/_development/metazip/CODE_OF_CONDUCT.md)
Contributor Covenant

#### [MODIFY] [LICENSE](file:///Users/clo/Documents/_development/metazip/LICENSE)
Verify MIT license is complete with correct year/name

---

### Deployment

#### [NEW] [.github/workflows/deploy.yml](file:///Users/clo/Documents/_development/metazip/.github/workflows/deploy.yml)
- Build Rust WASM
- Build Vite app
- Deploy to Vercel

#### [NEW] [vercel.json](file:///Users/clo/Documents/_development/metazip/vercel.json)
```json
{
  "buildCommand": "cd rust-wasm && wasm-pack build --target web && cd .. && bun run build",
  "outputDirectory": "dist"
}
```

---

## Verification Plan

### Automated Tests
```bash
# Rust unit tests
cd rust-wasm && cargo test

# TypeScript type checking
bun run typecheck

# Lint
bun run lint
```

### Manual Verification
- [ ] Drag-drop upload works
- [ ] Click upload works
- [ ] Clipboard paste (`Ctrl+V`) works
- [ ] JPEG metadata stripped correctly (verify with exiftool)
- [ ] PNG metadata stripped
- [ ] WebP metadata stripped
- [ ] File >50MB shows error
- [ ] Unsupported format shows error
- [ ] Single download works
- [ ] Copy to clipboard works (single image)
- [ ] ZIP download works (5+ files)
- [ ] "Clear All" clears memory and UI
- [ ] Theme toggle persists across refresh
- [ ] PWA installs and works offline
- [ ] Mobile responsive (test on phone)
- [ ] No network requests after page load (DevTools)

### Browser Testing
- Chrome (primary)
- Firefox
- Safari
- Mobile Safari / Chrome

---

## Implementation Order

1. **Day 1**: Project setup, Tailwind, shadcn/ui
2. **Day 2**: Rust WASM module (core functions + benchmarks)
3. **Day 3**: WASM integration, Web Worker
4. **Day 4**: UploadZone (drag-drop + paste), ImageCard
5. **Day 5**: MetadataViewer, download + copy to clipboard
6. **Day 6**: Memory cleanup, badges, optimized thumbnails
7. **Day 7**: Theme, HowItWorks, PWA, polish
8. **Day 8**: Deployment, documentation, final testing

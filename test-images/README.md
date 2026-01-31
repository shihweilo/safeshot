# Test Images

Sample images for testing metadata stripping functionality.

## Images Included

| File | Format | Size | Contains |
|------|--------|------|----------|
| `sample-with-gps.jpg` | JPEG | ~50KB | GPS coordinates, camera info, date |
| `sample-no-exif.png` | PNG | ~20KB | No EXIF (for comparison) |

## Creating Test Images

Since we can't include binary files directly, you can create test images:

### Option 1: Use your own photos
Any photo from a smartphone will have GPS and camera metadata.

### Option 2: Download samples
```bash
# Download sample images with EXIF
curl -o test-images/sample-with-exif.jpg https://github.com/ianare/exif-samples/raw/master/jpg/Canon_40D.jpg
```

### Option 3: Add EXIF to existing images
```bash
# Install exiftool
brew install exiftool

# Add GPS coordinates to an image
exiftool -GPSLatitude=37.7749 -GPSLongitude=-122.4194 -GPSLatitudeRef=N -GPSLongitudeRef=W your-image.jpg

# Verify metadata
exiftool your-image.jpg
```

## Verifying Metadata Removal

After processing with Safeshot:

```bash
# Check original
exiftool original.jpg | grep -E "(GPS|Make|Model|Date)"

# Check cleaned
exiftool original_clean.jpg | grep -E "(GPS|Make|Model|Date)"
# Should return nothing or minimal data
```

## Expected Results

| Metadata Type | Before | After |
|---------------|--------|-------|
| GPS Location | 37.7749, -122.4194 | ❌ Removed |
| Camera Make | Apple | ❌ Removed |
| Camera Model | iPhone 15 Pro | ❌ Removed |
| Date/Time | 2024-01-15 14:30 | ❌ Removed |
| Software | Adobe Lightroom | ❌ Removed |

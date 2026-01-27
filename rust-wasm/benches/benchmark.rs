//! Benchmark tests for metazip-wasm
//!
//! Run benchmarks with: `cargo bench`

use std::io::Cursor;
use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};
use image::{ImageFormat, DynamicImage, RgbImage};

/// Generate a test image with specified dimensions
fn generate_test_image(width: u32, height: u32) -> Vec<u8> {
    let mut img = RgbImage::new(width, height);
    
    // Fill with gradient pattern
    for y in 0..height {
        for x in 0..width {
            let r = ((x * 255) / width) as u8;
            let g = ((y * 255) / height) as u8;
            let b = (((x + y) * 255) / (width + height)) as u8;
            img.put_pixel(x, y, image::Rgb([r, g, b]));
        }
    }
    
    // Encode as JPEG
    let dynamic_img = DynamicImage::ImageRgb8(img);
    let mut output = Vec::new();
    let mut cursor = Cursor::new(&mut output);
    let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut cursor, 85);
    dynamic_img.write_with_encoder(encoder).unwrap();
    output
}

/// Benchmark image loading
fn bench_image_loading(c: &mut Criterion) {
    let mut group = c.benchmark_group("image_loading");
    
    for size in [256, 512, 1024, 2048].iter() {
        let image_bytes = generate_test_image(*size, *size);
        
        group.bench_with_input(
            BenchmarkId::from_parameter(format!("{}x{}", size, size)),
            &image_bytes,
            |b, bytes| {
                b.iter(|| {
                    image::load_from_memory_with_format(black_box(bytes), ImageFormat::Jpeg).unwrap()
                })
            },
        );
    }
    
    group.finish();
}

/// Benchmark image encoding (strip metadata simulation)
fn bench_image_encoding(c: &mut Criterion) {
    let mut group = c.benchmark_group("image_encoding");
    
    for size in [256, 512, 1024, 2048].iter() {
        let image_bytes = generate_test_image(*size, *size);
        let img = image::load_from_memory_with_format(&image_bytes, ImageFormat::Jpeg).unwrap();
        
        group.bench_with_input(
            BenchmarkId::from_parameter(format!("{}x{}", size, size)),
            &img,
            |b, img| {
                b.iter(|| {
                    let mut output = Vec::new();
                    let mut cursor = Cursor::new(&mut output);
                    let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut cursor, 95);
                    img.write_with_encoder(encoder).unwrap();
                    black_box(output)
                })
            },
        );
    }
    
    group.finish();
}

/// Benchmark full strip_metadata pipeline
fn bench_strip_pipeline(c: &mut Criterion) {
    let mut group = c.benchmark_group("strip_pipeline");
    
    for size in [256, 512, 1024].iter() {
        let image_bytes = generate_test_image(*size, *size);
        
        group.bench_with_input(
            BenchmarkId::from_parameter(format!("{}x{}", size, size)),
            &image_bytes,
            |b, bytes| {
                b.iter(|| {
                    // Load
                    let img = image::load_from_memory_with_format(black_box(bytes), ImageFormat::Jpeg).unwrap();
                    
                    // Re-encode (strips metadata)
                    let mut output = Vec::new();
                    let mut cursor = Cursor::new(&mut output);
                    let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut cursor, 95);
                    img.write_with_encoder(encoder).unwrap();
                    black_box(output)
                })
            },
        );
    }
    
    group.finish();
}

criterion_group!(
    benches,
    bench_image_loading,
    bench_image_encoding,
    bench_strip_pipeline
);

criterion_main!(benches);

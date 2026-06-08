#!/usr/bin/env python3
"""Create smaller image copies of the Symlabs brand images.

The source files are assumed to be exported at 8x. By default this creates
4x, 2x, 1x, and 0.5x PNG and WebP files beside the originals.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_IMAGES = (
    PROJECT_ROOT / "public" / "images" / "brand" / "symlabs.png",
    PROJECT_ROOT / "public" / "images" / "brand" / "symlabs-dark.png",
    PROJECT_ROOT / "public" / "images" / "brand" / "icon.png",
)
DEFAULT_SIZES = (4.0, 2.0, 1.0, 0.5)
DEFAULT_FORMATS = ("png", "webp")


def scale_label(scale: float) -> str:
    return f"{scale:g}x"


def output_path(source: Path, scale: float, output_dir: Path | None, image_format: str) -> Path:
    directory = output_dir if output_dir is not None else source.parent
    return directory / f"{source.stem}@{scale_label(scale)}.{image_format}"


def resized_dimensions(width: int, height: int, source_scale: float, target_scale: float) -> tuple[int, int]:
    ratio = target_scale / source_scale
    return max(1, round(width * ratio)), max(1, round(height * ratio))


def save_image(
    image: Image.Image,
    destination: Path,
    image_format: str,
    webp_quality: int,
    webp_lossless: bool,
) -> None:
    if image_format == "png":
        image.save(destination, format="PNG", optimize=True)
        return

    if image_format == "webp":
        image.save(
            destination,
            format="WEBP",
            quality=webp_quality,
            lossless=webp_lossless,
            method=6,
        )
        return

    raise ValueError(f"Unsupported format: {image_format}")


def resize_image(
    source: Path,
    source_scale: float,
    target_scales: tuple[float, ...],
    output_dir: Path | None,
    image_formats: tuple[str, ...],
    webp_quality: int,
    webp_lossless: bool,
) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Image not found: {source}")

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        source_width, source_height = image.size

        for target_scale in target_scales:
            target_width, target_height = resized_dimensions(
                source_width,
                source_height,
                source_scale,
                target_scale,
            )
            resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)

            for image_format in image_formats:
                destination = output_path(source, target_scale, output_dir, image_format)
                destination.parent.mkdir(parents=True, exist_ok=True)
                save_image(resized, destination, image_format, webp_quality, webp_lossless)

                print(
                    f"{source.name} {source_width}x{source_height} -> "
                    f"{destination.relative_to(PROJECT_ROOT)} {target_width}x{target_height}"
                )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate smaller PNG/WebP copies from 8x Symlabs logo/icon exports.",
    )
    parser.add_argument(
        "images",
        nargs="*",
        type=Path,
        default=DEFAULT_IMAGES,
        help="PNG images to resize. Defaults to the Symlabs brand images in public/images/brand.",
    )
    parser.add_argument(
        "--source-scale",
        type=float,
        default=8.0,
        help="Scale of the source exports. Defaults to 8.",
    )
    parser.add_argument(
        "--sizes",
        nargs="+",
        type=float,
        default=DEFAULT_SIZES,
        help="Target scale labels to generate. Defaults to 4 2 1 0.5.",
    )
    parser.add_argument(
        "--formats",
        nargs="+",
        choices=("png", "webp"),
        default=DEFAULT_FORMATS,
        help="Output formats to generate. Defaults to png webp.",
    )
    parser.add_argument(
        "--webp-quality",
        type=int,
        default=90,
        help="WebP quality from 1 to 100. Defaults to 90.",
    )
    parser.add_argument(
        "--webp-lossless",
        action="store_true",
        help="Use lossless WebP instead of quality-based compression.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=None,
        help="Optional output directory. Defaults to writing beside each source image.",
    )

    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.source_scale <= 0:
        raise ValueError("--source-scale must be greater than 0.")

    target_scales = tuple(args.sizes)
    if not target_scales or any(scale <= 0 for scale in target_scales):
        raise ValueError("--sizes must contain one or more positive numbers.")

    if not 1 <= args.webp_quality <= 100:
        raise ValueError("--webp-quality must be between 1 and 100.")

    output_dir = args.output_dir.resolve() if args.output_dir else None
    image_formats = tuple(dict.fromkeys(args.formats))
    for image_path in args.images:
        resize_image(
            image_path.resolve(),
            args.source_scale,
            target_scales,
            output_dir,
            image_formats,
            args.webp_quality,
            args.webp_lossless,
        )


if __name__ == "__main__":
    main()

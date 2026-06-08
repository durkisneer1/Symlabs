import type { ImgHTMLAttributes } from 'react';

type BrandImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function BrandIcon({
  alt = 'Symlabs',
  loading = 'eager',
  ...props
}: BrandImageProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/images/brand/icon@0.5x.webp 40w, /images/brand/icon@1x.webp 79w, /images/brand/icon@2x.webp 158w, /images/brand/icon@4x.webp 317w"
        sizes="40px"
      />
      <img
        src="/images/brand/icon@1x.png"
        srcSet="/images/brand/icon@0.5x.png 40w, /images/brand/icon@1x.png 79w, /images/brand/icon@2x.png 158w, /images/brand/icon@4x.png 317w"
        sizes="40px"
        width="79"
        height="79"
        alt={alt}
        loading={loading}
        decoding="async"
        {...props}
      />
    </picture>
  );
}

export function BrandWordmark({
  alt = 'Symlabs',
  loading = 'eager',
  ...props
}: BrandImageProps) {
  return (
    <>
      <picture className="dark:hidden">
        <source
          type="image/webp"
          srcSet="/images/brand/symlabs@0.5x.webp 318w, /images/brand/symlabs@1x.webp 636w, /images/brand/symlabs@2x.webp 1271w, /images/brand/symlabs@4x.webp 2542w"
          sizes="(min-width: 768px) 180px, 140px"
        />
        <img
          src="/images/brand/symlabs@1x.png"
          srcSet="/images/brand/symlabs@0.5x.png 318w, /images/brand/symlabs@1x.png 636w, /images/brand/symlabs@2x.png 1271w, /images/brand/symlabs@4x.png 2542w"
          sizes="(min-width: 768px) 180px, 140px"
          width="636"
          height="128"
          alt={alt}
          loading={loading}
          decoding="async"
          {...props}
        />
      </picture>
      <picture className="hidden dark:block">
        <source
          type="image/webp"
          srcSet="/images/brand/symlabs-dark@0.5x.webp 318w, /images/brand/symlabs-dark@1x.webp 636w, /images/brand/symlabs-dark@2x.webp 1271w, /images/brand/symlabs-dark@4x.webp 2542w"
          sizes="(min-width: 768px) 180px, 140px"
        />
        <img
          src="/images/brand/symlabs-dark@1x.png"
          srcSet="/images/brand/symlabs-dark@0.5x.png 318w, /images/brand/symlabs-dark@1x.png 636w, /images/brand/symlabs-dark@2x.png 1271w, /images/brand/symlabs-dark@4x.png 2542w"
          sizes="(min-width: 768px) 180px, 140px"
          width="636"
          height="128"
          alt={alt}
          loading={loading}
          decoding="async"
          {...props}
        />
      </picture>
    </>
  );
}

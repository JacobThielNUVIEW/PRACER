import Image from 'next/image';
import React from 'react';
import { IMAGES } from '@/lib/constants';

type Brand = keyof typeof IMAGES['logos'];

type PartnerLogoProps = {
  src?: string;
  brand?: Brand;
  alt?: string;
  size?: number | string; // px or css value (legacy shorthand)
  width?: number;
  height?: number;
  aspect?: number; // width / height ratio, e.g. 1 for square, 3/1 for wide
  className?: string;
  contain?: boolean; // use object-contain vs object-cover
  dark?: boolean; // prefer dark asset when available
  invert?: boolean; // fallback: apply CSS invert filter when dark asset missing
  ariaLabel?: string;
};

export default function PartnerLogo({
  src,
  brand,
  alt = 'Partner logo',
  size = 48,
  width,
  height,
  aspect,
  className = '',
  contain = true,
  dark = false,
  invert = false,
  ariaLabel,
}: PartnerLogoProps) {
  // Resolve source: explicit src > brand mapping > dark mapping > fallback to empty string
  const brandKey = brand as string | undefined;
  let resolvedSrc = src ?? (brand ? IMAGES.logos[brand] : undefined) ?? '';
  if (dark && brandKey) {
    const darkKey = `${brandKey}Dark` as keyof typeof IMAGES['logos'];
    const darkSrc = IMAGES.logos[darkKey];
    if (darkSrc) resolvedSrc = darkSrc;
  }
  const pxSize = typeof size === 'number' ? `${size}px` : size;
  const resolvedWidth = width ?? (typeof size === 'number' ? size : undefined);
  const resolvedHeight = height ?? (typeof size === 'number' ? size : undefined);
  const aspectStyle: React.CSSProperties = aspect ? { aspectRatio: String(aspect) } : {};

  return (
    <div
      className={`partner-logo inline-block align-middle ${className}`}
      style={{ width: pxSize, height: pxSize, ...aspectStyle }}
      role="img"
      aria-label={ariaLabel ?? alt}
    >
      {/* Next/image requires a non-empty src; when missing, render nothing to avoid runtime errors */}
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          width={resolvedWidth}
          height={resolvedHeight}
          sizes="(max-width: 640px) 48px, 64px"
          className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`}
          style={invert ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
        />
      ) : null}
    </div>
  );
}

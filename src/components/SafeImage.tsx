"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

export const LOCAL_FALLBACKS = {
  hero: "/images/1.png",
  project: "/images/2.png",
  partner: "/images/partners-1.png",
  about: "/images/about.png",
} as const;

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
  fallbackSrcs?: string[];
};

function isRemote(value: string): boolean {
  return /^(https?:)?\/\//i.test(value);
}

export default function SafeImage({
  src,
  fallbackSrc = LOCAL_FALLBACKS.project,
  fallbackSrcs = [],
  alt,
  unoptimized,
  ...props
}: SafeImageProps) {
  const candidates = [src, ...fallbackSrcs, fallbackSrc].filter(
    (value, index, list): value is string =>
      Boolean(value) && list.indexOf(value) === index,
  );

  const [index, setIndex] = useState(0);
  const [lastSrc, setLastSrc] = useState(src);

  if (src !== lastSrc) {
    setLastSrc(src);
    setIndex(0);
  }

  const activeSrc = candidates[Math.min(index, candidates.length - 1)];

  return (
    <Image
      {...props}
      src={activeSrc}
      alt={alt}
      unoptimized={unoptimized ?? isRemote(activeSrc)}
      onError={() => {
        setIndex((current) => Math.min(current + 1, candidates.length - 1));
      }}
    />
  );
}

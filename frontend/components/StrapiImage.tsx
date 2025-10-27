// FILE: frontend/components/StrapiImage.tsx
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface StrapiImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function StrapiImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: StrapiImageProps) {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 ${className}`}
        style={{ width, height }}
        aria-label={alt}
      />
    );
  }

  const imageUrl = src.startsWith("/") ? `${STRAPI_URL}${src}` : src;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
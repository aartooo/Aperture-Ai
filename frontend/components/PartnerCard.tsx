// FILE: frontend/components/PartnerCard.tsx
import { Partner } from "../lib/types";
import { StrapiImage } from "./StrapiImage";

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const { name, websiteUrl, logo } = partner;

  // Validate URL
  const validUrl = websiteUrl && /^https?:\/\//i.test(websiteUrl) ? websiteUrl : "#";

  // Debug log (optional — remove in production)
  console.log(`Partner: ${name}, URL: ${websiteUrl}, Valid URL: ${validUrl}`);

  return (
    <a
      href={validUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto cursor-pointer flex-shrink-0 w-40 h-20 mx-4 flex items-center justify-center p-2 opacity-70 transition-all hover:opacity-100 hover:scale-105"
      title={name}
      onClick={(e) => {
        if (validUrl === "#") {
          e.preventDefault();
          console.warn(`Invalid or missing URL for partner: ${name}`);
        }
      }}
      // REMOVED: inline style & z-index 1000 — breaks mobile
    >
      <StrapiImage
        src={logo.url}
        alt={`${name} logo`}
        width={logo.width || 120}
        height={logo.height || 60}
        className="object-contain h-full w-full pointer-events-none"
        priority={true}
      />
    </a>
  );
}
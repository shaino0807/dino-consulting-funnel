import Image from "next/image";

import { cn } from "@/lib/utils";

type AvatarProps = {
  src: string;
  alt: string;
  className?: string;
};

export function Avatar({ src, alt, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-lift",
        className
      )}
    >
      <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
    </div>
  );
}

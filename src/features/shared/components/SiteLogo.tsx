import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "full" | "icon";
  logoClassName?: string;
  textClassName?: string;
  href?: string;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  className,
  width = 32,
  height = 32,
  variant = "icon",
  logoClassName,
  textClassName,
  href = "/",
}) => {
  if (variant === "icon") {
    return (
      <Link
        href={href}
        className={cn("inline-flex items-center justify-center shrink-0", className)}
      >
        <Image
          src="/shared/logo.webp"
          alt="Kapuletu Logo"
          width={width}
          height={height}
          className={cn("object-contain", logoClassName)}
          style={{ height: "auto", width: "auto" }}
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center font-bold tracking-tight text-primary transition-all",
        className,
      )}
    >
      <span className={textClassName}>Kap</span>
      <div className={cn("mx-1 flex shrink-0 items-center justify-center", logoClassName)}>
        <Image
          src="/shared/logo.webp"
          alt="Kapuletu Logo"
          width={width}
          height={height}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <span className={cn("text-refined-blue", textClassName)}>Letu</span>
    </Link>
  );
};

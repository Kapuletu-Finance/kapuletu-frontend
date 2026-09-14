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
  href?: string | null;
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
  const iconContent = (
    <Image
      src="/shared/logo.webp"
      alt="Kapuletu Logo"
      width={width}
      height={height}
      className={cn("object-contain", logoClassName)}
      style={{ height: "auto", width: "auto" }}
      priority
    />
  );

  const fullContent = (
    <Image
      src="/shared/kapuletu-logo.png"
      alt="Kapuletu Logo"
      width={140}
      height={40}
      className={cn("object-contain", logoClassName)}
      style={{ height: "auto", width: "auto" }}
      priority
    />
  );

  const content = variant === "icon" ? iconContent : fullContent;
  const wrapperClass =
    variant === "icon"
      ? cn("inline-flex items-center justify-center shrink-0", className)
      : cn(
          "flex items-center justify-center font-bold tracking-tight text-primary transition-all",
          className,
        );

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
};

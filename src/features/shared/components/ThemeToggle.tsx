"use client";

import { useTheme } from "next-themes";
import type React from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive";
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "default", className }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={className}
    >
      <IconLibrary
        name="sun"
        className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <IconLibrary
        name="moon"
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

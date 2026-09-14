"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-background !text-foreground !border-border !shadow-md !rounded-xl",
          success:
            "!bg-background !text-primary !border !border-primary/30 !rounded-xl [&_svg]:!text-primary",
          error:
            "!bg-background !text-destructive !border !border-destructive/30 !rounded-xl [&_svg]:!text-destructive",
          warning:
            "!bg-background !text-amber-600 !border !border-amber-400/40 !rounded-xl [&_svg]:!text-amber-600",
          info:
            "!bg-background !text-blue-600 !border !border-blue-400/40 !rounded-xl [&_svg]:!text-blue-600",
          title: "!font-medium !text-[0.875rem]",
          description: "!text-muted-foreground !text-[0.8125rem]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

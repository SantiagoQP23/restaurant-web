import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

/**
 * Status label, like the app's `Label`: a pastel pill with bold text and no
 * dot. Pick the status through `variant` only.
 */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-container text-on-primary-container",
        neutral: "bg-gray-100 text-gray-600",
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-orange-100 text-orange-800",
        error: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
        outline:
          "border-border font-semibold text-on-surface-variant [a]:hover:bg-muted",
        // Kept for existing screens: same as `neutral` and `error`.
        secondary: "bg-gray-100 text-gray-600",
        destructive: "bg-red-100 text-red-700",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-6 px-3 text-xs [&>svg]:size-3.5!",
        md: "h-7 px-4 text-sm [&>svg]:size-4!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

function Badge({
  className,
  variant = "default",
  size = "sm",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants, type BadgeVariant }

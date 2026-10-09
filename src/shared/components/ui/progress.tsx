import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const progressVariants = cva(
  "relative flex h-3 w-full items-center",
  {
    variants: {
      variant: {
        default: "overflow-x-hidden rounded-full bg-muted",
        segmented: "gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    segments?: number
  }

function Progress({
  className,
  value,
  variant = "default",
  segments,
  ...props
}: ProgressProps) {
  if (variant === "segmented" && segments && segments > 0) {
    const filledSegments = Math.round(((value || 0) / 100) * segments)

    return (
      <ProgressPrimitive.Root
        data-slot="progress"
        value={value}
        className={cn(progressVariants({ variant }), className)}
        {...props}
      >
        {Array.from({ length: segments }, (_, index) => (
          <span
            key={index}
            data-slot="progress-segment"
            className={cn(
              "h-full flex-1 rounded-full bg-muted transition-all",
              index < filledSegments && "bg-primary"
            )}
          />
        ))}
      </ProgressPrimitive.Root>
    )
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }

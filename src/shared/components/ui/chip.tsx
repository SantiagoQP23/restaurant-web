import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"

/**
 * Filter chip, like the app's `Chip`: 6px corners and a 1px ink line when
 * unselected, the ink-blue wash with a leading check when selected.
 */
function Chip({
  className,
  selected = false,
  icon,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  selected?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-slot="chip"
      data-selected={selected}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-primary px-4 text-sm font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:cursor-pointer hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[selected=true]:border-secondary data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground data-[selected=true]:hover:bg-secondary/80 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gray-600 data-[selected=true]:[&_svg]:text-secondary-foreground",
        className
      )}
      {...props}
    >
      {icon ?? (selected && <CheckIcon />)}
      {children}
    </button>
  )
}

export { Chip }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-black uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(163,251,46,0.3)] hover:bg-primary/90 hover:shadow-[6px_6px_0px_0px_rgba(163,251,46,0.5)] active:bg-primary",
        destructive:
          "bg-destructive text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,0.3)] hover:bg-destructive/90 hover:shadow-[6px_6px_0px_0px_rgba(239,68,68,0.5)] active:bg-destructive",
        outline:
          "border-2 border-white/10 bg-transparent text-white hover:border-primary hover:text-primary hover:bg-primary/5 shadow-none hover:shadow-[4px_4px_0px_0px_rgba(163,251,46,0.2)] active:bg-primary active:text-black active:border-black",
        secondary:
          "bg-secondary text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(204,255,0,0.3)] hover:bg-secondary/90 hover:shadow-[6px_6px_0px_0px_rgba(204,255,0,0.5)] active:bg-secondary",
        ghost:
          "hover:bg-primary/10 hover:text-primary transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

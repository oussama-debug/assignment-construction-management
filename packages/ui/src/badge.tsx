import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-dashed border px-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] [&>svg]:shrink-0 leading-normal",
  {
    variants: {
      variant: {
        default:
          "border-transparent border-blue-300! bg-blue-50 text-blue-700 [a&]:hover:bg-blue-100",
        secondary:
          "border-transparent bg-purple-50 text-purple-700 [a&]:hover:bg-purple-100",
        destructive:
          "border-transparent bg-red-50 text-red-700 [a&]:hover:bg-red-100 focus-visible:ring-red-200",
        success:
          "border-transparent bg-green-50 text-green-700 [a&]:hover:bg-green-100",
        warning:
          "border-transparent bg-yellow-50 text-yellow-700 [a&]:hover:bg-yellow-100",
        outline:
          "text-gray-700 border-gray-200 [a&]:hover:bg-gray-50 [a&]:hover:text-gray-900",
        "gray-light":
          "border-transparent bg-gray-50 text-gray-600 [a&]:hover:bg-gray-100",
        "gray-medium":
          "border-transparent bg-gray-100 text-gray-700 [a&]:hover:bg-gray-200",
        "gray-dark":
          "border-transparent bg-gray-200 text-gray-800 [a&]:hover:bg-gray-300",
        "gray-darker":
          "border-transparent bg-gray-800 text-gray-100 [a&]:hover:bg-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

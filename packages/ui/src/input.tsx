"use client";

import * as React from "react";

import { cn } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "inset" | "phone";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input bg-background text-xs ring-offset-background file:text-xs file:text-foreground placeholder:text-muted-foreground md:text-xs flex h-10 w-full rounded-md border px-3 py-2 shadow-xs file:border-0 file:bg-transparent file:font-medium focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          variant === "inset" && "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
          variant === "phone" &&
            "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

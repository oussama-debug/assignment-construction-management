"use client";

import * as React from "react";

import { cn } from "./utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "border-input bg-background text-xs ring-offset-background placeholder:text-muted-foreground md:text-xs flex min-h-[60px] w-full resize-none rounded-md border px-3 py-2 shadow-xs focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

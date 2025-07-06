"use client";
import React from "react";
import * as NavigationMenuPrimitives from "@radix-ui/react-navigation-menu";
import { cn } from "./utils";

function getSubtree(
  options: { asChild: boolean | undefined; children: React.ReactNode },
  content: React.ReactNode | ((children: React.ReactNode) => React.ReactNode)
) {
  const { asChild, children } = options;
  if (!asChild)
    return typeof content === "function" ? content(children) : content;

  const firstChild = React.Children.only(children) as React.ReactElement<{
    children?: React.ReactNode;
  }>;
  return React.cloneElement(firstChild, {
    children:
      typeof content === "function"
        ? content(firstChild.props.children)
        : content,
  });
}

const TabNavigation = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitives.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Root>,
    "orientation" | "defaultValue" | "dir"
  >
>(({ className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Root ref={forwardedRef} {...props} asChild={false}>
    <NavigationMenuPrimitives.List
      className={cn(
        "flex items-center justify-start w-full whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </NavigationMenuPrimitives.List>
  </NavigationMenuPrimitives.Root>
));

TabNavigation.displayName = "TabNavigation";

const TabNavigationLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitives.Link>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Link>,
    "onSelect"
  > & {
    disabled?: boolean;
    active?: boolean;
  }
>(
  (
    { asChild, disabled, active, className, children, ...props },
    forwardedRef
  ) => (
    <NavigationMenuPrimitives.Item
      className="flex flex-1"
      aria-disabled={disabled}
    >
      <NavigationMenuPrimitives.Link
        aria-disabled={disabled}
        data-active={active}
        className={cn(
          "group relative flex flex-1 shrink-0 select-none items-center justify-center",
          disabled ? "pointer-events-none" : ""
        )}
        ref={forwardedRef}
        asChild={asChild}
        {...props}
      >
        {getSubtree({ asChild, children }, (children) => (
          <span
            className={cn(
              "relative flex flex-1 items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
              "text-gray-500 hover:text-gray-700",
              active && [
                "text-primary font-semibold",
                "after:absolute after:-bottom-0.5 after:rounded-full after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-['']",
              ],
              disabled && "pointer-events-none text-gray-300",
              className
            )}
          >
            {children}
          </span>
        ))}
      </NavigationMenuPrimitives.Link>
    </NavigationMenuPrimitives.Item>
  )
);

TabNavigationLink.displayName = "TabNavigationLink";

export { TabNavigation, TabNavigationLink };

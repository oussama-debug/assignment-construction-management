"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@civalgo/ui/icons/logo";

interface AuthFormLayoutProps {
  title: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  onSubmit: (e: React.FormEvent) => void;
  maxHeight?: string;
  minHeight?: string;
}

export function AuthFormLayout({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  onSubmit,
  maxHeight = "max-h-[calc(520/16*1rem)]",
  minHeight = "min-h-[calc(320/16*1rem)]",
}: AuthFormLayoutProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`relative border border-gray-200 bg-gray-950/3 ${maxHeight} ${minHeight} flex w-full max-w-[24rem] flex-1 flex-col justify-center rounded-md`}
    >
      <div className="shadow-fade flex flex-1 flex-col justify-center gap-y-4 rounded-t-md rounded-b-md border border-gray-950/3 bg-white p-10">
        <header className="w-full flex-col items-start justify-start px-0! py-2">
          <Logo width={150} className="-ml-2" />
          <p className="text-xs font-family-sans text-zinc-500">{title}</p>
        </header>

        {children}
        <div className="flex w-full flex-col justify-start items-start">
          <p className="text-xs text-pretty font-family-sans text-zinc-500 w-full">
            By proceeding, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and consent to the practices described in our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <footer className="text-xs flex w-full items-center justify-center space-x-1 py-3 font-family-sans text-zinc-500">
        <span>{footerText}</span>
        <Link
          href={footerLinkHref}
          className="text-xs rounded font-family-sans text-primary hover:underline focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none"
        >
          {footerLinkText}
        </Link>
      </footer>
    </form>
  );
}

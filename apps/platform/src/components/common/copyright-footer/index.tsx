"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CopyrightFooter() {
  return (
    <footer className="flex w-full space-y-1 max-w-[24rem] px-2 py-4 flex-col justify-start items-start">
      <p className="text-xs text-pretty font-family-sans text-zinc-500 w-full">
        {new Date().getFullYear()} © Test platform. All rights reserved.
      </p>
      <div className="w-full flex flex-row justify-start space-x-2 items-center">
        <Link
          href="/terms"
          className="text-zinc-400 text-[.74rem] flex flex-row justify-start items-center space-x-1 hover:underline"
        >
          <span>Terms of Service</span>
          <ChevronRight size={12} />
        </Link>
        <Link
          href="/privacy"
          className="text-zinc-400 text-[.74rem] flex flex-row justify-start items-center space-x-1 hover:underline"
        >
          <span>Privacy Policy</span>
          <ChevronRight size={12} />
        </Link>
      </div>
    </footer>
  );
}

"use client";

import React, { type SVGProps } from "react";

export function CheckCircle({
  className = "",
}: {
  className?: string;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="43"
      height="42"
      viewBox="0 0 43 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="21.5" cy="21" r="20" stroke="#10B981" strokeWidth="2" />
      <path
        d="M14.5 21L19.5 26L29.5 16"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

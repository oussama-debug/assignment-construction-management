import React, { type SVGProps } from "react";

export function ApplePay({
  className = "",
  ...props
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
      {...props}
    >
      <mask
        id="mask0_1_1452"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        width="41"
        height="41"
      >
        <circle cx="21.5003" cy="21.0003" r="20.0003" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1_1452)">
        <rect
          x="1.49982"
          y="6.56436"
          width="18.7503"
          height="38.1863"
          rx="2.50004"
          fill="#1075DB"
          fillOpacity="0.35"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.499062 9.0644C0.499062 7.13138 2.06608 5.56436 3.9991 5.56436H17.7493C19.6823 5.56436 21.2493 7.13138 21.2493 9.0644V16.0003H21.4993C22.1896 16.0003 22.7493 16.5599 22.7493 17.2503V24.7504C22.7493 25.4408 22.1896 26.0004 21.4993 26.0004H21.2493V42.2506C21.2493 44.1836 19.6823 45.7507 17.7493 45.7507H3.9991C2.06608 45.7507 0.499062 44.1836 0.499062 42.2506V9.0644ZM3.9991 7.56436C3.17065 7.56436 2.49906 8.23595 2.49906 9.0644V42.2506C2.49906 43.0791 3.17065 43.7507 3.9991 43.7507H17.7493C18.5778 43.7507 19.2493 43.0791 19.2493 42.2506V9.0644C19.2493 8.23595 18.5778 7.56436 17.7493 7.56436H14.9998V7.75001C14.9998 8.44037 14.4401 9.00002 13.7498 9.00002H7.24981C6.55944 9.00002 5.99979 8.44037 5.99979 7.75001V7.56436H3.9991Z"
          fill="#0E83FE"
        />
        <path
          className="side-click-arrow"
          d="M37.7501 21.0003H26.4999M26.4999 21.0003L31.5 16.0002M26.4999 21.0003L31.5 26.0004"
          stroke="#0E83FE"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <circle
        cx="21.5003"
        cy="21.0003"
        r="20.0003"
        stroke="#0E83FE"
        strokeWidth="2"
      />
    </svg>
  );
}

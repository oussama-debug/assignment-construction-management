import { SVGProps } from "react";

const Emblem = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="20"
        y="26"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="currentColor"
        textAnchor="middle"
        letterSpacing="-0.5px"
      >
        C
      </text>
    </svg>
  );
};

export { Emblem };

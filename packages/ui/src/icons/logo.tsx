import { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" {...props}>
    <text
      x="10"
      y="28"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="600"
      fill="currentColor"
      letterSpacing="-0.5px"
    >
      civalgo
    </text>
  </svg>
);

export { Logo };

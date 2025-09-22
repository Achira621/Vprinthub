import type { SVGProps } from "react";

export function VPrintIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 207 48"
        {...props}
        >
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
            </linearGradient>
        </defs>
        <path
            d="M.75 31.789V.75h10.36v20.485l9.366-20.485h10.45L21.571 31.79H11.5L20.8 12.334l-9.676 19.455H.75zm17.954 15.46V35.4h22.919v-2.775l-13.62-13.62h13.62V.75H29.07v15.46H18.704v2.775l13.119 13.119H18.704v15.155h22.919V44.47H18.704z"
            fill="url(#logo-gradient)"
        />
        <text x="50" y="32" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">
            V-PRINT HUB
        </text>
        </svg>
    )
}
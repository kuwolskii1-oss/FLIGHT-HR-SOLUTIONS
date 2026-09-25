import type { SVGProps } from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}
export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 15L15 5M7 5h8v8" />
    </svg>
  );
}
export function Chevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 16 16" {...props}>
      <path d="M4 6.5L8 10.5L12 6.5" />
    </svg>
  );
}
/** The learn-more chevron: two arms about the apex (10, 8) that spread into an arrow on hover. */
export function LearnChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 16 16" width={16} height={16} {...props}>
      <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
      <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
    </svg>
  );
}
export function Menu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function Close(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function WhatsApp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 24 24" strokeWidth={1.6} {...props}>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.2L4 20z" />
      <path d="M9.2 8.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.1-.2.3 0 .5a6 6 0 0 0 2.9 2.6c.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4a2 2 0 0 1-1.4 1.9c-.6.2-1.4.2-2.6-.3a8.5 8.5 0 0 1-4.3-3.9c-.7-1.2-.7-2.2-.5-2.8.1-.3.3-.7.5-.9z" />
    </svg>
  );
}

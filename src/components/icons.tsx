import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icons = {
  stethoscope: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 3v6a4 4 0 0 0 8 0V3" /><path d="M4 3H2m2 0h2M12 3h-2m2 0h2" /><path d="M8 17a5 5 0 0 0 10 0v-1" /><circle cx="19" cy="13" r="2" /></svg>
  ),
  "heart-hand": (p: IconProps) => (
    <svg {...base} {...p}><path d="M11 14h2a2 2 0 1 0 0-4h-3l-2.5-2A2 2 0 0 0 4 9.5V17" /><path d="M4 21h2.5a4 4 0 0 0 2.8-1.2l4-4a2 2 0 0 0-2.8-2.8L9 16" /><path d="M16.5 4.5c-1.2-1.2-3-1-4 .2-1-1.2-2.8-1.4-4-.2-1.3 1.3-1 3.2.3 4.5L12.5 12l3.7-3C17.5 7.7 17.8 5.8 16.5 4.5Z" /></svg>
  ),
  users: (p: IconProps) => (
    <svg {...base} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  "shield-heart": (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M12 16s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.3A1.8 1.8 0 0 1 15 12c0 2.2-3 4-3 4Z" /></svg>
  ),
  home: (p: IconProps) => (
    <svg {...base} {...p}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></svg>
  ),
  utensils: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 3v7a2 2 0 0 0 4 0V3" /><path d="M6 10v11" /><path d="M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9" /></svg>
  ),
  activity: (p: IconProps) => (
    <svg {...base} {...p}><path d="M22 12h-4l-3 8-4-16-3 8H2" /></svg>
  ),
  phone: (p: IconProps) => (
    <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
  ),
  mail: (p: IconProps) => (
    <svg {...base} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  ),
  mapPin: (p: IconProps) => (
    <svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  clock: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  briefcase: (p: IconProps) => (
    <svg {...base} {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  ),
  star: (p: IconProps) => (
    <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5L2.5 9.4 9 8.5 12 2.5Z" /></svg>
  ),
  brain: (p: IconProps) => (
    <svg {...base} {...p}><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5a3 3 0 0 0-2 5.5A3 3 0 0 0 7 16v.5A2.5 2.5 0 0 0 12 17V4.5A2.5 2.5 0 0 0 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v.5a3 3 0 0 1 2 5.5 3 3 0 0 1-2 5.5v.5a2.5 2.5 0 0 1-5 .5" /></svg>
  ),
};

export type IconName = keyof typeof Icons;

export function Icon({ name, ...props }: { name: string } & IconProps) {
  const Cmp = Icons[name as IconName] ?? Icons.activity;
  return <Cmp {...props} />;
}

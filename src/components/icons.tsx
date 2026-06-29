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
  chat: (p: IconProps) => (
    <svg {...base} {...p}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-1L3 20l1-4.5a8.5 8.5 0 0 1-1-4A8.38 8.38 0 0 1 11.5 3 8.38 8.38 0 0 1 21 11.5Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></svg>
  ),
  facebook: (p: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.29-.04-1.3-.12-2.46-.12-2.43 0-4.1 1.49-4.1 4.22V9.9H7.4V13h2.74v8h3.36Z" /></svg>
  ),
  instagram: (p: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>
  ),
  linkedin: (p: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9.2h4V21H3V9.2Zm6 0h3.83v1.62h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.43c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.41-2.08 2.87V21H9V9.2Z" /></svg>
  ),
  x: (p: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.2 2.5h2.9l-6.36 7.27L22.5 21.5h-6.06l-4.74-6.2-5.43 6.2H1.36l6.8-7.78L1.5 2.5h6.2l4.29 5.67 4.95-5.67Zm-1.02 17.2h1.6L7.05 4.2H5.32l11.86 15.5Z" /></svg>
  ),
  google: (p: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 10.2v3.92h5.45c-.24 1.4-1.66 4.12-5.45 4.12A6.24 6.24 0 0 1 12 5.8c1.77 0 2.96.76 3.64 1.4l2.48-2.39C16.52 3.32 14.5 2.5 12 2.5a9.5 9.5 0 1 0 0 19c5.48 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.16-1.58H12Z" /></svg>
  ),
};

export type IconName = keyof typeof Icons;

export function Icon({ name, ...props }: { name: string } & IconProps) {
  const Cmp = Icons[name as IconName] ?? Icons.activity;
  return <Cmp {...props} />;
}

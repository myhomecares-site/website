import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { Reveal } from "./Reveal";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-page ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  muted = false,
  id,
  reveal = true,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
  reveal?: boolean;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${muted ? "bg-surface" : ""} ${className}`}>
      <Container>{reveal ? <Reveal>{children}</Reveal> : children}</Container>
    </section>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "white" | "ghost";
  className?: string;
  withArrow?: boolean;
};

export function Button({ href, children, variant = "primary", className = "", withArrow }: ButtonProps) {
  const styles: Record<string, string> = {
    primary:
      "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md",
    outline:
      "border border-primary/30 text-primary hover:border-primary hover:bg-primary-50",
    white: "bg-white text-primary hover:bg-primary-50 shadow-sm",
    ghost: "text-ink hover:text-primary",
  };
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${styles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {withArrow && (
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-3">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h2>
      {intro && <p className="mt-4 text-lg text-muted leading-relaxed">{intro}</p>}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

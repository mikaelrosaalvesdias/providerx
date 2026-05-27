"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "neon" | "ghost" | "quiet" | "danger" | "icon";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      children,
      onClick,
      leading,
      trailing,
      href,
      className,
      ...rest
    },
    ref,
  ) => {
    const cls = clsx("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, className);

    function setRipple(e: React.MouseEvent<Element>) {
      const t = e.currentTarget as HTMLElement;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--rx", `${e.clientX - r.left}px`);
      t.style.setProperty("--ry", `${e.clientY - r.top}px`);
    }

    if (href) {
      return (
        <Link href={href} className={cls} onClick={setRipple as React.MouseEventHandler}>
          {leading}
          {children}
          {trailing ? <span className="arrow">{trailing}</span> : null}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cls}
        onClick={(e) => {
          setRipple(e);
          onClick?.(e);
        }}
        {...rest}
      >
        {leading}
        {children}
        {trailing ? <span className="arrow">{trailing}</span> : null}
      </button>
    );
  },
);
Button.displayName = "Button";

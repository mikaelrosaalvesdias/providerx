import { type HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  pad?: boolean | "sm";
  link?: boolean;
}

export function Card({ pad = false, link = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "card",
        pad === true && "card-pad",
        pad === "sm" && "card-pad-sm",
        link && "card-link",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

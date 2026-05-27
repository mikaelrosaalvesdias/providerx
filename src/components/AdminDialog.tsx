"use client";

import { ReactNode, useRef } from "react";
import { Plus, X } from "lucide-react";

export function AdminDialog({
  title,
  description,
  triggerLabel,
  variant = "primary",
  children,
}: {
  title: string;
  description?: string;
  triggerLabel: string;
  variant?: "primary" | "subtle";
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={variant === "primary" ? "admin-dialog-trigger" : "subtle-button"}
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        {variant === "primary" ? <Plus size={17} /> : null}
        {triggerLabel}
      </button>
      <dialog className="admin-dialog" ref={dialogRef}>
        <div className="admin-dialog-header">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p> : null}
          </div>
          <button className="icon-button" onClick={() => dialogRef.current?.close()} type="button" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </dialog>
    </>
  );
}

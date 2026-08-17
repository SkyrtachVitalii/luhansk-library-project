"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends DialogPrimitive.Popup.Props {
  side?: "top" | "bottom" | "left" | "right";
  showClose?: boolean;
  overlayClassName?: string;
}

function SheetContent({
  className,
  children,
  side = "top",
  showClose = true,
  overlayClassName,
  ...props
}: SheetContentProps) {
  const sideStyles = {
    top: "inset-x-0 top-0 border-b data-[starting-style]:-translate-y-full data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-full data-[ending-style]:opacity-0",
    bottom: "inset-x-0 bottom-0 border-t data-[starting-style]:translate-y-full data-[starting-style]:opacity-0 data-[ending-style]:translate-y-full data-[ending-style]:opacity-0",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[starting-style]:-translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:-translate-x-full data-[ending-style]:opacity-0",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[starting-style]:translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:translate-x-full data-[ending-style]:opacity-0",
  };

  return (
    <SheetPortal>
      <SheetOverlay className={overlayClassName} />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        initialFocus={false}
        className={cn(
          "fixed z-[1001] gap-4 bg-background p-6 shadow-2xl transition-all duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none transform-gpu",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-5 top-5 rounded-lg p-2.5 bg-[var(--accessibility-btn-bg)] text-[var(--accent-color1)] shadow-sm transition-all hover:bg-[var(--accessibility-btn-hover-bg)] active:scale-93 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color3)] disabled:pointer-events-none">
            <X className="h-5 w-5" />
            <span className="sr-only">Закрити</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
};

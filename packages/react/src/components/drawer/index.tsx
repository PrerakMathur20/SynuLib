import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';
import { trapFocus } from '@synu/core';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export function Drawer({ open, onClose, side = 'right', title, description, children, footer, closeOnBackdrop = true, closeOnEsc = true, className }: DrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const cleanup = contentRef.current ? trapFocus(contentRef.current) : undefined;
    const prev = document.activeElement as HTMLElement | null;
    contentRef.current?.focus();
    return () => { cleanup?.(); prev?.focus(); };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div className="synu-drawer-backdrop" aria-hidden="true" onClick={closeOnBackdrop ? onClose : undefined} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(`synu-drawer-content synu-drawer-content--${side}`, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="synu-drawer-header">
            {title && <h2 className="synu-drawer-title">{title}</h2>}
            {description && <p className="synu-drawer-description">{description}</p>}
            <button className="synu-drawer-close" onClick={onClose} aria-label="Close drawer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
        <div className="synu-drawer-body">{children}</div>
        {footer && <div className="synu-drawer-footer">{footer}</div>}
      </div>
    </Portal>
  );
}


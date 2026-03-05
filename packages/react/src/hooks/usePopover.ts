import { useState, useCallback, useRef, useId } from 'react';

export interface UsePopoverReturn<T extends HTMLElement = HTMLElement> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  anchorRef: React.RefObject<T>;
  triggerProps: {
    onClick: () => void;
    'aria-haspopup': 'true';
    'aria-expanded': boolean;
    'aria-controls': string;
    ref: React.RefObject<T>;
  };
  popoverProps: {
    id: string;
    role: 'dialog';
    'aria-modal': false;
  };
  popoverId: string;
}

export function usePopover<T extends HTMLElement = HTMLElement>(
  defaultOpen = false,
): UsePopoverReturn<T> {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const anchorRef = useRef<T>(null);
  const popoverId = useId();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    anchorRef,
    triggerProps: {
      onClick: toggle,
      'aria-haspopup': 'true',
      'aria-expanded': isOpen,
      'aria-controls': popoverId,
      ref: anchorRef,
    },
    popoverProps: {
      id: popoverId,
      role: 'dialog',
      'aria-modal': false,
    },
    popoverId,
  };
}

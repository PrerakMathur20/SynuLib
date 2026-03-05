import { useState, useCallback, useId } from 'react';

export interface UseDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  dialogProps: {
    open: boolean;
    onClose: () => void;
    'aria-modal': true;
    role: 'dialog';
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  };
  triggerProps: {
    onClick: () => void;
    'aria-haspopup': 'dialog';
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  titleId: string;
  descriptionId: string;
}

export function useDialog(defaultOpen = false): UseDialogReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-desc`;

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    dialogProps: {
      open: isOpen,
      onClose: close,
      'aria-modal': true,
      role: 'dialog',
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
    triggerProps: {
      onClick: open,
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': dialogId,
    },
    titleId,
    descriptionId,
  };
}

import { useState, useCallback, useRef, useId } from 'react';

export interface UseMenuReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  getMenuProps: () => {
    id: string;
    role: 'menu';
    'aria-orientation': 'vertical';
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  getItemProps: (index: number) => {
    role: 'menuitem';
    tabIndex: number;
    'aria-selected': boolean;
    onMouseEnter: () => void;
  };
}

export function useMenu(itemCount = 0): UseMenuReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuId = useId();

  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % itemCount);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, itemCount, close],
  );

  const getMenuProps = useCallback(
    () => ({
      id: menuId,
      role: 'menu' as const,
      'aria-orientation': 'vertical' as const,
      onKeyDown: handleKeyDown,
    }),
    [menuId, handleKeyDown],
  );

  const getItemProps = useCallback(
    (index: number) => ({
      role: 'menuitem' as const,
      tabIndex: activeIndex === index ? 0 : -1,
      'aria-selected': activeIndex === index,
      onMouseEnter: () => setActiveIndex(index),
    }),
    [activeIndex],
  );

  return {
    isOpen,
    open,
    close,
    activeIndex,
    setActiveIndex,
    getMenuProps,
    getItemProps,
  };
}

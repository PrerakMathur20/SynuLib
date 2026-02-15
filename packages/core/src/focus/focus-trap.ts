export function trapFocus(element: HTMLElement) {
  const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])' as const;
  const focusable = Array.from(element.querySelectorAll(focusableSelectors)) as HTMLElement[];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  // Return cleanup function
  return () => element.removeEventListener('keydown', handleKeyDown);
}

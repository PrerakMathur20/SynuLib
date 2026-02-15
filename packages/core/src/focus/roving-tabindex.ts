export function rovingTabIndex(container: HTMLElement, options?: { activeIndex?: number }) {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [role="button"], a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
  let activeIndex = options?.activeIndex ?? 0;

  const setActive = (index: number) => {
    activeIndex = index;
    focusable.forEach((el, i) => {
      el.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    focusable[index]?.focus();
  };

  if (focusable.length > 0) {
    setActive(activeIndex);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setActive((activeIndex + 1) % focusable.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setActive((activeIndex - 1 + focusable.length) % focusable.length);
    } else if (e.key === 'Home') {
      setActive(0);
    } else if (e.key === 'End') {
      setActive(focusable.length - 1);
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

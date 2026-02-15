/**
 * Tracks whether focus was triggered via keyboard input and applies
 * the `focus-visible` class accordingly — matching the CSS :focus-visible spec.
 * Returns a cleanup function to remove all listeners.
 */
export function useFocusVisible(element: HTMLElement): () => void {
  let hadKeyboardEvent = false;

  const onPointerDown = () => {
    hadKeyboardEvent = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    // Ignore modifier-only keypresses
    if (!['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) return;
    hadKeyboardEvent = true;
  };

  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && hadKeyboardEvent) {
      target.classList.add('focus-visible');
    }
  };

  const onBlur = (e: FocusEvent) => {
    const target = e.target as HTMLElement | null;
    if (target) {
      target.classList.remove('focus-visible');
    }
  };

  element.addEventListener('pointerdown', onPointerDown, true);
  element.addEventListener('keydown', onKeyDown, true);
  element.addEventListener('focus', onFocus, true);
  element.addEventListener('blur', onBlur, true);

  return () => {
    element.removeEventListener('pointerdown', onPointerDown, true);
    element.removeEventListener('keydown', onKeyDown, true);
    element.removeEventListener('focus', onFocus, true);
    element.removeEventListener('blur', onBlur, true);
  };
}

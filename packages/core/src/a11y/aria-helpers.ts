/**
 * ARIA attribute helpers.
 * Imperative setters for use in non-framework environments.
 * Framework adapters should use the corresponding prop-object helpers instead.
 */

// --- Imperative setters ---

export function setAriaLabelledBy(element: HTMLElement, id: string): void {
  element.setAttribute('aria-labelledby', id);
}

export function setAriaDescribedBy(element: HTMLElement, id: string): void {
  element.setAttribute('aria-describedby', id);
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean): void {
  element.setAttribute('aria-expanded', String(expanded));
}

export function setAriaHidden(element: HTMLElement, hidden: boolean): void {
  element.setAttribute('aria-hidden', String(hidden));
}

export function setAriaControls(element: HTMLElement, id: string): void {
  element.setAttribute('aria-controls', id);
}

// --- Prop-object helpers (framework-agnostic, usable in React/Vue/etc.) ---

export function ariaLabelledByProps(id: string): Record<string, string> {
  return { 'aria-labelledby': id };
}

export function ariaDescribedByProps(id: string): Record<string, string> {
  return { 'aria-describedby': id };
}

export function ariaExpandedProps(expanded: boolean): Record<string, string> {
  return { 'aria-expanded': String(expanded) };
}

export function ariaHiddenProps(hidden: boolean): Record<string, string> {
  return { 'aria-hidden': String(hidden) };
}

// Keep legacy exports for backward compatibility
/** @deprecated Use setAriaLabelledBy instead */
export const ariaLabelledBy = setAriaLabelledBy;
/** @deprecated Use setAriaDescribedBy instead */
export const ariaDescribedBy = setAriaDescribedBy;


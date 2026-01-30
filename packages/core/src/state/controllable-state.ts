/**
 * Determines whether a value is controlled (externally managed) or uncontrolled.
 * Returns the resolved value and a no-op setter indicator for framework adapters.
 *
 * Framework adapters (e.g. react/) are responsible for implementing
 * useControllableState using this utility as a type helper.
 */
export function isControlled<T>(value: T | undefined): value is T {
  return typeof value !== 'undefined';
}

/**
 * Resolves the initial state for an uncontrolled component.
 * If `controlled` is defined, returns it directly.
 * Otherwise returns `defaultValue`.
 */
export function resolveInitialState<T>(controlled: T | undefined, defaultValue: T): T {
  return isControlled(controlled) ? controlled : defaultValue;
}

/**
 * Lightweight state machine factory — no external dependencies.
 * A minimal alternative to XState for simple state transitions.
 */

export type Transition<S extends string, E extends string> = {
  [state in S]?: { [event in E]?: S };
};

export interface MachineConfig<S extends string, E extends string, C> {
  id: string;
  initial: S;
  context: C;
  states: Transition<S, E>;
}

export interface MachineInstance<S extends string, E extends string, C> {
  id: string;
  initialState: S;
  initialContext: C;
  transition: (state: S, event: E) => S;
}

export function createMachine<S extends string, E extends string, C>(
  config: MachineConfig<S, E, C>,
): MachineInstance<S, E, C> {
  return {
    id: config.id,
    initialState: config.initial,
    initialContext: config.context,
    transition(state: S, event: E): S {
      return (config.states[state]?.[event] as S | undefined) ?? state;
    },
  };
}

/** No-op assign helper for API compatibility */
export function assign<C>(updater: Partial<C> | ((ctx: C) => Partial<C>)): typeof updater {
  return updater;
}

/** No-op setup helper for API compatibility */
export function setup<_T>(_config: _T): { createMachine: typeof createMachine } {
  return { createMachine };
}

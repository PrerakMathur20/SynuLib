// Re-export xstate primitives for use within core package primitives.
// External consumers should depend on xstate directly.
export { setup, createMachine, assign, type StateFrom, type EventFrom } from 'xstate';

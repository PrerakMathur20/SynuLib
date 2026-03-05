import { createMachine } from '../../state/create-machine.js';
import type { ButtonContext, ButtonEvent } from './button.types.js';

type ButtonState = 'idle' | 'pressed';
type ButtonEventType = ButtonEvent['type'];

export const buttonMachine = createMachine<ButtonState, ButtonEventType, ButtonContext>({
  id: 'button',
  initial: 'idle',
  context: { disabled: false },
  states: {
    idle:    { PRESS: 'pressed' },
    pressed: { RELEASE: 'idle' },
  },
});

import { useCallback, useState } from 'react';

export type ButtonState = 'idle' | 'pressed';

export interface ButtonContext {
  disabled: boolean;
}

export type ButtonEvent = { type: 'PRESS' } | { type: 'RELEASE' };

export function useButton() {
  const [value, setValue] = useState<ButtonState>('idle');

  const send = useCallback((event: ButtonEvent) => {
    if (event.type === 'PRESS') setValue('pressed');
    else if (event.type === 'RELEASE') setValue('idle');
  }, []);

  return { state: { value }, send };
}

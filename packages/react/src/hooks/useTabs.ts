import { useState, useCallback, useId } from 'react';

export interface UseTabsReturn {
  value: string;
  setValue: (value: string) => void;
  getTabProps: (tabValue: string) => {
    role: 'tab';
    id: string;
    'aria-selected': boolean;
    'aria-controls': string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  getPanelProps: (tabValue: string) => {
    role: 'tabpanel';
    id: string;
    'aria-labelledby': string;
    hidden: boolean;
    tabIndex: number;
  };
}

export function useTabs(
  defaultValue: string,
  values?: string[],
): UseTabsReturn {
  const [value, setValue] = useState(defaultValue);
  const baseId = useId();

  const getTabId = (tabValue: string) => `${baseId}-tab-${tabValue}`;
  const getPanelId = (tabValue: string) => `${baseId}-panel-${tabValue}`;

  const handleKeyDown = useCallback(
    (tabValue: string) => (e: React.KeyboardEvent) => {
      if (!values || values.length === 0) return;
      const currentIndex = values.indexOf(tabValue);
      let next: string | undefined;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next = values[(currentIndex + 1) % values.length];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        next = values[(currentIndex - 1 + values.length) % values.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = values[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        next = values[values.length - 1];
      }
      if (next !== undefined) setValue(next);
    },
    [values],
  );

  const getTabProps = useCallback(
    (tabValue: string) => ({
      role: 'tab' as const,
      id: getTabId(tabValue),
      'aria-selected': value === tabValue,
      'aria-controls': getPanelId(tabValue),
      tabIndex: value === tabValue ? 0 : -1,
      onClick: () => setValue(tabValue),
      onKeyDown: handleKeyDown(tabValue),
    }),
    [value, handleKeyDown],
  );

  const getPanelProps = useCallback(
    (tabValue: string) => ({
      role: 'tabpanel' as const,
      id: getPanelId(tabValue),
      'aria-labelledby': getTabId(tabValue),
      hidden: value !== tabValue,
      tabIndex: 0,
    }),
    [value],
  );

  return { value, setValue, getTabProps, getPanelProps };
}

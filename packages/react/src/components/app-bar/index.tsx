import React from 'react';
import { cn } from '../../utils/cn.js';

export type AppBarVariant = 'default' | 'primary' | 'transparent';
export type AppBarElevation = 'none' | 'sm' | 'md';

export interface AppBarProps {
  leading?: React.ReactNode;
  title?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: AppBarVariant;
  elevation?: AppBarElevation;
  sticky?: boolean;
  className?: string;
}

export function AppBar({
  leading,
  title,
  trailing,
  variant = 'default',
  elevation = 'sm',
  sticky = false,
  className,
}: AppBarProps): JSX.Element {
  return (
    <header
      className={cn(
        'synu-app-bar',
        variant !== 'default' && `synu-app-bar--${variant}`,
        elevation !== 'none' && `synu-app-bar--elevation-${elevation}`,
        sticky && 'synu-app-bar--sticky',
        className,
      )}
    >
      {leading && <div className="synu-app-bar__leading">{leading}</div>}
      {title && <div className="synu-app-bar__title">{title}</div>}
      {trailing && <div className="synu-app-bar__trailing">{trailing}</div>}
    </header>
  );
}

AppBar.displayName = 'AppBar';

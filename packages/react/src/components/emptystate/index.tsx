import React from 'react';
import { cn } from '../../utils/cn.js';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('synu-empty-state', className)} role="status">
      {icon && <div className="synu-empty-state__icon" aria-hidden="true">{icon}</div>}
      <h3 className="synu-empty-state__title">{title}</h3>
      {description && <p className="synu-empty-state__description">{description}</p>}
      {action && <div className="synu-empty-state__action">{action}</div>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

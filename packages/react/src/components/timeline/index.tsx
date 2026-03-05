import React from 'react';
import { cn } from '../../utils/cn.js';

export type TimelineVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface TimelineItem {
  id: string;
  title: string;
  description?: React.ReactNode;
  date?: string;
  icon?: React.ReactNode;
  variant?: TimelineVariant;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps): JSX.Element {
  return (
    <ol className={cn('synu-timeline', className)} aria-label="Timeline">
      {items.map((item, index) => {
        const variant = item.variant ?? 'default';
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className="synu-timeline__item">
            <div className="synu-timeline__track" aria-hidden="true">
              <div className={cn('synu-timeline__dot', `synu-timeline__dot--${variant}`)}>
                {item.icon ?? null}
              </div>
              {!isLast && <div className="synu-timeline__connector" />}
            </div>
            <div className="synu-timeline__content">
              <div className="synu-timeline__header">
                <span className="synu-timeline__title">{item.title}</span>
                {item.date && (
                  <time className="synu-timeline__date" dateTime={item.date}>
                    {item.date}
                  </time>
                )}
              </div>
              {item.description && (
                <div className="synu-timeline__desc">{item.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

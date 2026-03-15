import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Card ─────────────────────────────────────────────────
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'elevated' | 'ghost';
  clickable?: boolean;
  /** Override the rendered element. Defaults to `article` for non-clickable cards
   *  (semantic grouping for screen readers) and `div` for clickable cards. */
  as?: React.ElementType;
}
export const Card = forwardRef<HTMLElement, CardProps>(({ variant = 'default', clickable = false, as: Tag, className, children, ...props }, ref) => {
  const Component = Tag ?? (clickable ? 'div' : 'article');
  return (
    <Component
      ref={ref}
      className={cn('tokis-card', variant !== 'default' && `tokis-card--${variant}`, clickable && 'tokis-card--clickable', className)}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >{children}</Component>
  );
});
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('tokis-card-header', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('tokis-card-body', className)} {...props} />
));
CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('tokis-card-footer', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('tokis-card-title', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('tokis-card-description', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

// ─── Divider ──────────────────────────────────────────────
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
}
export const Divider = forwardRef<HTMLHRElement, DividerProps>(({ orientation = 'horizontal', label, className, ...props }, ref) => {
  if (label) {
    return (
      <div className={cn('tokis-divider tokis-divider--with-text', className)}>
        <span className="tokis-divider__text">{label}</span>
      </div>
    );
  }
  return (
    <hr
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn('tokis-divider', orientation === 'vertical' && 'tokis-divider--vertical', className)}
      {...props}
    />
  );
});
Divider.displayName = 'Divider';


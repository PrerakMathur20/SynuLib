import React, { createContext, useContext, useId, useState } from 'react';
import { cn } from '../../utils/cn.js';

// Context lets RadioGroup pass state to Radio at any nesting depth —
// fixing arrow-key nav for card/wrapper patterns where Radio isn't a direct child.
interface RadioGroupContextValue {
  name: string;
  value?: string;
  groupDisabled: boolean;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export interface RadioProps {
  value: string;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Radio({ value, label, description, disabled = false, checked, name, onChange, className }: RadioProps) {
  const ctx = useContext(RadioGroupContext);
  const autoId = useId();
  const radioId = `radio-${autoId}`;
  const descId = description ? `${radioId}-desc` : undefined;

  // When inside a RadioGroup, use context values; otherwise fall back to own props.
  const resolvedName = ctx?.name ?? name ?? '';
  const resolvedChecked = ctx ? ctx.value === value : (checked ?? false);
  const resolvedDisabled = ctx ? (ctx.groupDisabled || disabled) : disabled;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) return;
    if (ctx) { ctx.onChange?.(value); } else { onChange?.(value); }
  };

  return (
    <label
      className={cn('tokis-radio-root', className)}
      data-disabled={resolvedDisabled || undefined}
      htmlFor={radioId}
    >
      <input
        type="radio"
        id={radioId}
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        disabled={resolvedDisabled}
        onChange={handleChange}
        className="tokis-radio-native"
        aria-describedby={descId}
      />
      <span
        aria-hidden="true"
        className="tokis-radio-control"
        data-checked={resolvedChecked ? 'true' : undefined}
      />
      {(label || description) && (
        <div>
          {label && <span className="tokis-radio-label">{label}</span>}
          {description && <p id={descId} className="tokis-radio-description">{description}</p>}
        </div>
      )}
    </label>
  );
}

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  orientation = 'vertical',
  disabled = false,
  children,
  className,
  label,
}: RadioGroupProps) {
  const groupId = useId();
  const resolvedName = name ?? groupId;

  // Support uncontrolled usage via defaultValue
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (v: string) => {
    if (!isControlled) setUncontrolledValue(v);
    onChange?.(v);
  };

  return (
    <RadioGroupContext.Provider value={{ name: resolvedName, value, groupDisabled: disabled, onChange: handleChange }}>
      <div
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
        aria-disabled={disabled || undefined}
        className={cn('tokis-radio-group', orientation === 'horizontal' && 'tokis-radio-group--horizontal', className)}
      >
        {label && <span id={groupId} className="tokis-label" style={{ marginBottom: 'var(--tokis-spacing-1)' }}>{label}</span>}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

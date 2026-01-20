import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';
import { TextField } from '../input/index.js';
import { ButtonRoot } from '../button/index.js';
import { Portal } from '../portal/index.js';
import { Card, CardBody, CardHeader } from '../card/index.js';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../table/index.js';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export function Autocomplete({ options, value, onChange, label, placeholder = 'Search...', ...props }: AutocompleteProps) {
  const [query, setQuery] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())), [options, query]);

  return (
    <div className="synu-autocomplete">
      <TextField
        label={label}
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
          setOpen(true);
        }}
        {...props}
      />
      {open && filtered.length > 0 && (
        <div className="synu-autocomplete-list" role="listbox">
          {filtered.map((option) => (
            <button
              key={option.value}
              type="button"
              className="synu-autocomplete-item"
              onClick={() => {
                setQuery(option.label);
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return <div className={cn('synu-button-group', orientation === 'vertical' && 'synu-button-group--vertical', className)} {...props} />;
}

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function FloatingActionButton({ children, label = 'Action', className, ...props }: FloatingActionButtonProps) {
  return (
    <ButtonRoot className={cn('synu-fab', className)} iconOnly aria-label={label} {...props}>
      {children}
    </ButtonRoot>
  );
}

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
}

export function NumberField({ label, value = 0, onChange, step = 1, min, max, ...props }: NumberFieldProps) {
  const parsedStep = Number(step) || 1;
  const minNum = typeof min === 'number' ? min : undefined;
  const maxNum = typeof max === 'number' ? max : undefined;

  const update = (next: number) => {
    const boundedMin = minNum !== undefined ? Math.max(minNum, next) : next;
    const bounded = maxNum !== undefined ? Math.min(maxNum, boundedMin) : boundedMin;
    onChange?.(bounded);
  };

  return (
    <div className="synu-number-field">
      <TextField
        {...props}
        type="number"
        label={label}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="synu-number-field-actions">
        <ButtonRoot size="sm" variant="outline" onClick={() => update(value - parsedStep)}>-</ButtonRoot>
        <ButtonRoot size="sm" variant="outline" onClick={() => update(value + parsedStep)}>+</ButtonRoot>
      </div>
    </div>
  );
}

export interface RatingProps {
  value?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({ value = 0, max = 5, readOnly = false, onChange }: RatingProps) {
  return (
    <div className="synu-rating" role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }).map((_, index) => {
        const current = index + 1;
        return (
          <button
            key={current}
            type="button"
            role="radio"
            aria-checked={current <= value}
            disabled={readOnly}
            className={cn('synu-rating-star', current <= value && 'synu-rating-star--active')}
            onClick={() => onChange?.(current)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export interface TransferItem {
  id: string;
  label: string;
}

export interface TransferListProps {
  left: TransferItem[];
  right: TransferItem[];
  onChange: (left: TransferItem[], right: TransferItem[]) => void;
  leftTitle?: string;
  rightTitle?: string;
}

export function TransferList({ left, right, onChange, leftTitle = 'Available', rightTitle = 'Selected' }: TransferListProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const moveToRight = () => {
    const moved = left.filter((item) => leftChecked.includes(item.id));
    onChange(left.filter((item) => !leftChecked.includes(item.id)), [...right, ...moved]);
    setLeftChecked([]);
  };

  const moveToLeft = () => {
    const moved = right.filter((item) => rightChecked.includes(item.id));
    onChange([...left, ...moved], right.filter((item) => !rightChecked.includes(item.id)));
    setRightChecked([]);
  };

  const renderPane = (title: string, items: TransferItem[], checked: string[], setChecked: (ids: string[]) => void) => (
    <Card className="synu-transfer-pane">
      <CardHeader>{title}</CardHeader>
      <CardBody>
        {items.map((item) => (
          <label key={item.id} className="synu-transfer-item">
            <input
              type="checkbox"
              checked={checked.includes(item.id)}
              onChange={(e) => setChecked(e.target.checked ? [...checked, item.id] : checked.filter((id) => id !== item.id))}
            />
            {item.label}
          </label>
        ))}
      </CardBody>
    </Card>
  );

  return (
    <div className="synu-transfer-list">
      {renderPane(leftTitle, left, leftChecked, setLeftChecked)}
      <div className="synu-transfer-actions">
        <ButtonRoot size="sm" onClick={moveToRight}>{'>'}</ButtonRoot>
        <ButtonRoot size="sm" onClick={moveToLeft}>{'<'}</ButtonRoot>
      </div>
      {renderPane(rightTitle, right, rightChecked, setRightChecked)}
    </div>
  );
}

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function ToggleButton({ selected, className, ...props }: ToggleButtonProps) {
  return <button className={cn('synu-toggle-button', selected && 'synu-toggle-button--selected', className)} {...props} />;
}

export interface ToggleButtonGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  children: React.ReactElement<ToggleButtonProps>[];
}

export function ToggleButtonGroup({ value, onChange, children }: ToggleButtonGroupProps) {
  return (
    <div className="synu-toggle-group" role="group">
      {children.map((child) => {
        const childValue = child.props.value as string;
        const selected = value.includes(childValue);
        return React.cloneElement(child, {
          key: childValue,
          selected,
          onClick: () => {
            if (selected) {
              onChange(value.filter((item) => item !== childValue));
            } else {
              onChange([...value, childValue]);
            }
          },
        });
      })}
    </div>
  );
}

export interface SynuIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: 'search' | 'close' | 'menu' | 'check' | 'star' | 'arrow-right';
}

const iconMap: Record<SynuIconProps['name'], string> = {
  search: '⌕',
  close: '×',
  menu: '☰',
  check: '✓',
  star: '★',
  'arrow-right': '→',
};

export function Icon({ name, className, ...props }: SynuIconProps) {
  return <span className={cn('synu-icon', className)} aria-hidden="true" {...props}>{iconMap[name]}</span>;
}

export interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: string;
}

export function MaterialIcon({ icon, className, ...props }: MaterialIconProps) {
  return <span className={cn('synu-material-icon', className)} {...props}>{icon}</span>;
}

export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClick?: () => void;
}

export function Backdrop({ open, onClick, className, children, ...props }: BackdropProps) {
  if (!open) return null;
  return (
    <div className={cn('synu-backdrop', className)} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  position?: 'static' | 'sticky' | 'fixed';
}

export function AppBar({ position = 'static', className, ...props }: AppBarProps) {
  return <header className={cn('synu-app-bar', `synu-app-bar--${position}`, className)} {...props} />;
}

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3;
}

export function Paper({ elevation = 1, className, ...props }: PaperProps) {
  return <div className={cn('synu-paper', `synu-paper--${elevation}`, className)} {...props} />;
}

export interface BottomNavigationItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface BottomNavigationProps {
  value: string;
  onChange: (value: string) => void;
  items: BottomNavigationItem[];
}

export function BottomNavigation({ value, onChange, items }: BottomNavigationProps) {
  return (
    <nav className="synu-bottom-nav" aria-label="Bottom Navigation">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn('synu-bottom-nav-item', item.value === value && 'synu-bottom-nav-item--active')}
          onClick={() => onChange(item.value)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export interface SpeedDialAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface SpeedDialProps {
  label?: string;
  actions: SpeedDialAction[];
}

export function SpeedDial({ label = 'Open actions', actions }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="synu-speed-dial">
      {open && (
        <div className="synu-speed-dial-actions">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="synu-speed-dial-action"
              onClick={() => {
                action.onClick?.();
                setOpen(false);
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      <FloatingActionButton label={label} onClick={() => setOpen((state) => !state)}>+</FloatingActionButton>
    </div>
  );
}

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
}

export function Stepper({ steps, activeStep }: StepperProps) {
  return (
    <ol className="synu-stepper">
      {steps.map((step, index) => (
        <li key={step.label} className={cn('synu-step', index <= activeStep && 'synu-step--active')}>
          <span className="synu-step-index">{index + 1}</span>
          <div>
            <div className="synu-step-label">{step.label}</div>
            {step.description && <div className="synu-step-description">{step.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface ImageListProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

export function ImageList({ cols = 3, className, style, ...props }: ImageListProps) {
  return <div className={cn('synu-image-list', className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...style }} {...props} />;
}

export function ImageListItem(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="synu-image-list-item" {...props} />;
}

export interface ClickAwayListenerProps {
  onClickAway: () => void;
  children: React.ReactElement;
}

export function ClickAwayListener({ onClickAway, children }: ClickAwayListenerProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClickAway();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClickAway]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      ref.current = node;
    },
  });
}

export function CssBaseline() {
  return (
    <style>{`*, *::before, *::after { box-sizing: border-box; } body { margin: 0; min-height: 100vh; }`}</style>
  );
}

export function InitColorSchemeScript() {
  const script = `(() => {
    const stored = localStorage.getItem('synu-theme');
    const mode = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', mode);
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <Portal>
      <div className="synu-modal-root" role="presentation" onClick={onClose}>
        <div className="synu-modal-content" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Portal>
  );
}

export interface NoSsrProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function NoSsr({ children, fallback = null }: NoSsrProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

export interface PopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export function Popper({ anchorEl, open, children, placement = 'bottom-start' }: PopperProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl || !open) return;
    const rect = anchorEl.getBoundingClientRect();
    const isBottom = placement.startsWith('bottom');
    setPos({
      top: (isBottom ? rect.bottom : rect.top) + window.scrollY + (isBottom ? 8 : -8),
      left: (placement.endsWith('start') ? rect.left : rect.right) + window.scrollX,
    });
  }, [anchorEl, open, placement]);

  if (!open) return null;

  return (
    <Portal>
      <div className="synu-popper" style={{ top: pos.top, left: pos.left }}>
        {children}
      </div>
    </Portal>
  );
}

export interface TextareaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

export function TextareaAutosize({ minRows = 3, maxRows = 8, onChange, ...props }: TextareaAutosizeProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    const rowHeight = 24;
    const minHeight = minRows * rowHeight;
    const maxHeight = maxRows * rowHeight;
    ref.current.style.height = `${Math.min(maxHeight, Math.max(minHeight, ref.current.scrollHeight))}px`;
  };

  useEffect(() => {
    resize();
  }, []);

  return (
    <textarea
      ref={ref}
      className="synu-textarea synu-textarea-autosize"
      onChange={(event) => {
        resize();
        onChange?.(event);
      }}
      {...props}
    />
  );
}

export interface FadeProps {
  in: boolean;
  children: React.ReactNode;
}

export function Fade({ in: visible, children }: FadeProps) {
  return <div className={cn('synu-fade', visible && 'synu-fade--in')}>{children}</div>;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export interface DataGridColumn {
  field: string;
  headerName: string;
}

export interface DataGridProps {
  columns: DataGridColumn[];
  rows: Array<Record<string, React.ReactNode>>;
}

export function DataGrid({ columns, rows }: DataGridProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.field}>{column.headerName}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column.field}>{row[column.field]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function DatePicker({ label, ...props }: DatePickerProps) {
  return <TextField type="date" label={label} {...props} />;
}

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function TimePicker({ label, ...props }: TimePickerProps) {
  return <TextField type="time" label={label} {...props} />;
}

export interface DateTimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function DateTimePicker({ label, ...props }: DateTimePickerProps) {
  return <TextField type="datetime-local" label={label} {...props} />;
}

export interface ChartsProps {
  data: number[];
  labels?: string[];
}

export function Charts({ data, labels = [] }: ChartsProps) {
  const max = Math.max(...data, 1);
  return (
    <div className="synu-chart" role="img" aria-label="Bar chart">
      {data.map((value, index) => (
        <div key={index} className="synu-chart-bar-wrap">
          <div className="synu-chart-bar" style={{ height: `${(value / max) * 100}%` }} title={`${labels[index] ?? index}: ${value}`} />
          <span className="synu-chart-label">{labels[index] ?? index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
}

function TreeBranch({ node }: { node: TreeNode }) {
  const [open, setOpen] = useState(true);
  const hasChildren = Boolean(node.children?.length);

  return (
    <li>
      <button type="button" className="synu-tree-item" onClick={() => setOpen((state) => !state)}>
        {hasChildren ? (open ? '▾' : '▸') : '•'} {node.label}
      </button>
      {hasChildren && open && (
        <ul className="synu-tree-list">
          {node.children?.map((child) => <TreeBranch key={child.id} node={child} />)}
        </ul>
      )}
    </li>
  );
}

export function TreeView({ data }: TreeViewProps) {
  return (
    <ul className="synu-tree-list" role="tree">
      {data.map((node) => <TreeBranch key={node.id} node={node} />)}
    </ul>
  );
}

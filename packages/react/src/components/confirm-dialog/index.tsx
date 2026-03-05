import React from 'react';
import { Dialog } from '../dialog/index.js';
import { cn } from '../../utils/cn.js';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  className?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  className,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      className={cn('synu-confirm-dialog', className)}
      footer={
        <div className="synu-confirm-dialog__actions">
          <button
            type="button"
            className="synu-confirm-dialog__cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn('synu-confirm-dialog__confirm', destructive && 'synu-confirm-dialog__confirm--destructive')}
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="synu-confirm-dialog__spinner" aria-hidden="true" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      }
    />
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';

'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

export interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action: () => void | Promise<void>;
  textAction?: string;
  textCancel?: string;

  disabled?: boolean;

  delayMs?: number;
}

export const ConfirmDialog = ({
  children,
  title,
  description,
  action,
  textAction = 'Continue',
  textCancel = 'Cancel',
  disabled = false,
  delayMs
}: ConfirmDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [internalDisabled, setInternalDisabled] = React.useState(
    disabled || (!!delayMs && delayMs > 0)
  );
  const [progress, setProgress] = React.useState(0);

  // Reset & sync when dialog opens/closes or props change
  React.useEffect(() => {
    if (open) {
      setInternalDisabled(disabled || (!!delayMs && delayMs > 0));
    } else {
      // reset progress when dialog closes
      setProgress(0);
    }
  }, [open, disabled, delayMs]);

  // Timer to auto‑enable button + animate progress bar
  React.useEffect(() => {
    if (!open || !internalDisabled || !delayMs || delayMs <= 0) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / delayMs) * 100);
      setProgress(pct);
      if (elapsed >= delayMs) {
        clearInterval(interval);
        setInternalDisabled(false);
        // give a slight delay before hiding the bar (for UX smoothness)
        setTimeout(() => setProgress(0), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [open, internalDisabled, delayMs]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await action();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="border-b-2 pb-2 mb-2">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className='text-md'>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="relative mt-2 h-1 w-full overflow-hidden rounded bg-muted/20">
            <div
              className="absolute left-0 top-0 h-full w-full origin-left scale-x-0 bg-primary transition-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{textCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={internalDisabled || loading}>
            {loading ? 'Processing...' : textAction}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

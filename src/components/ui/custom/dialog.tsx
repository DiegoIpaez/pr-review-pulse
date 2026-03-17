'use client';

import clsx from 'clsx';
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/custom/button';
import { ActionBtnProps } from '@/contracts/types';

type CheckOutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  headerProps: {
    title: string;
    description: string;
  };
  okBtnProps?: ActionBtnProps;
  cancelBtnProps?: ActionBtnProps;
  footer?: boolean;
};

export function DialogFooter({
  onOpenChange,
  okBtnProps,
  cancelBtnProps,
}: Pick<CheckOutModalProps, 'onOpenChange' | 'okBtnProps' | 'cancelBtnProps'>) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        className={clsx('cursor-pointer', cancelBtnProps?.className)}
        type={cancelBtnProps?.type || 'button'}
        variant="outline"
        onClick={
          cancelBtnProps?.onClick
            ? () => cancelBtnProps?.onClick?.()
            : () => onOpenChange(false)
        }
        disabled={cancelBtnProps?.disabled}
        isLoading={cancelBtnProps?.isLoading}
      >
        {cancelBtnProps?.children ?? 'Cerrar'}
      </Button>
      <Button
        className={clsx('cursor-pointer', okBtnProps?.className)}
        type={okBtnProps?.type || 'button'}
        onClick={okBtnProps?.onClick ? () => okBtnProps?.onClick?.() : () => {}}
        disabled={okBtnProps?.disabled}
        isLoading={okBtnProps?.isLoading}
      >
        {okBtnProps?.children ?? 'Aceptar'}
      </Button>
    </div>
  );
}

export function Dialog({
  open,
  onOpenChange,
  headerProps,
  okBtnProps,
  cancelBtnProps,
  children,
  footer = true,
}: CheckOutModalProps) {
  return (
    <DialogPrimitive open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background-soft shadow">
        <DialogHeader>
          <DialogTitle>{headerProps.title}</DialogTitle>
          <DialogDescription>{headerProps.description}</DialogDescription>
        </DialogHeader>
        {children}
        {footer && (
          <DialogFooter
            onOpenChange={onOpenChange}
            okBtnProps={okBtnProps}
            cancelBtnProps={cancelBtnProps}
          />
        )}
      </DialogContent>
    </DialogPrimitive>
  );
}

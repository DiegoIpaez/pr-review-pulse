import clsx from 'clsx';
import { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '@/components/ui/button';
import SpinnerCs from './SpinnerCs';

type ButtonCsProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: React.ReactNode;
  } & {
    isLoading?: boolean;
  };

export default function ButtonCs({ isLoading, ...props }: ButtonCsProps) {
  return (
    <Button
      className={clsx(props.className, {
        'opacity-70 cursor-not-allowed': isLoading,
        'opacity-100 cursor-pointer': !isLoading,
      })}
      {...props}
    >
      {isLoading && <SpinnerCs size={20} />}
      {props.children}
    </Button>
  );
}

import clsx from 'clsx';
import { VariantProps } from 'class-variance-authority';
import {
  Button as ButtonPrimitive,
  buttonVariants,
} from '@/components/ui/button';
import Spinner from './spinner';

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: React.ReactNode;
  } & {
    isLoading?: boolean;
  };

export default function Button({ isLoading, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={clsx(props.className, {
        'opacity-70 cursor-not-allowed': isLoading,
        'opacity-100 cursor-pointer': !isLoading,
      })}
      {...props}
    >
      {isLoading && <Spinner size={20} />}
      {props.children}
    </ButtonPrimitive>
  );
}

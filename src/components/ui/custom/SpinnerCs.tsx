import clsx from 'clsx';
import { Loader, type LucideProps } from 'lucide-react';

export default function SpinnerCs(props: LucideProps) {
  return (
    <Loader {...props} className={clsx('animate-spin', props.className)} />
  );
}

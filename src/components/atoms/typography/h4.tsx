import { cn } from '@/lib/utils';

export function H4({ className, ...props }: React.ComponentProps<'h4'>) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
  );
}

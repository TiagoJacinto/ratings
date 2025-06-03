import * as RadioGroup from '@radix-ui/react-radio-group';

import { cn } from '@/lib/utils';

export function RadioCard({ className, ...props }: React.ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root
      data-slot='radio-card'
      className={cn('grid w-full gap-3', className)}
      {...props}
    />
  );
}

export function RadioCardItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroup.Item>) {
  return (
    <RadioGroup.Item
      data-slot='radio-card-item'
      className={cn(
        'ring-border flex cursor-pointer flex-col gap-3 rounded-lg p-4 text-left ring-[1px] transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500',
        className,
      )}
      {...props}
    />
  );
}

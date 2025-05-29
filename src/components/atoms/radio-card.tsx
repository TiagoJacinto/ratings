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
        'ring-border flex cursor-pointer items-center gap-3 rounded px-3 py-2 ring-[1px] data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500',
        className,
      )}
      {...props}
    />
  );
}

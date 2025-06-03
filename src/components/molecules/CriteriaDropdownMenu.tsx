import { type FormSchema } from '@/view/form.schema';
import { type Criterion } from '@/view/domain/Criterion';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { Button } from '../atoms/button';

export function CriteriaDropdownMenu({
  criteria,
  isAllCriteriaSelected,
  isCriteriaSelected,
  onAllCriteriaSelected,
  onCriteriaSelected,
  text,
}: Readonly<{
  criteria: FormSchema['criteria'];
  isAllCriteriaSelected: boolean;
  text: string;
  onAllCriteriaSelected: () => void;
  onCriteriaSelected: (criterion: Criterion) => void;
  isCriteriaSelected: (criterion: Criterion) => boolean;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='secondary'
          className='bg-gray-500 text-white hover:bg-gray-600'
        >
          {text}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {criteria.length === 0 ? (
          <h1 className='text-center text-sm'>No criteria defined</h1>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => onAllCriteriaSelected()}
              disabled={isAllCriteriaSelected}
            >
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {criteria.map((criterion) => (
              <DropdownMenuItem
                key={criterion.id}
                onClick={() => onCriteriaSelected(criterion)}
                disabled={isCriteriaSelected(criterion)}
              >
                {criterion.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

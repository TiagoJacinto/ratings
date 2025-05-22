import { type FormSchema } from '@/view/form.schema';

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
}: Readonly<{
  criteria: FormSchema['criteria'];
  isAllCriteriaSelected: boolean;
  onAllCriteriaSelected: () => void;
  onCriteriaSelected: (criterionId: number) => void;
  isCriteriaSelected: (criterionId: number) => boolean;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='secondary'
          className='bg-gray-500 text-white hover:bg-gray-600'
        >
          Add Rating
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
                onClick={() => onCriteriaSelected(criterion.id)}
                disabled={isCriteriaSelected(criterion.id)}
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

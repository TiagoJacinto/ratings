import { type UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import { arrayActionsOf } from '@/view/utils/arrayActionsOf';
import { stateActionsOf } from '@/view/utils/stateActionsOf';
import { useTemporaryId } from '@/hooks/useTemporaryId';
import { Textarea } from '@/components/atoms/textarea';
import { usePagination } from '@/hooks/usePagination';
import {
  Pagination,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationContent,
  PaginationItem,
} from '@/components/atoms/pagination';

import { type FormSchema } from './form.view';

type CriteriaFormProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

export function CriteriaForm({ form }: CriteriaFormProps) {
  const criteria = form.watch('criteria');

  const { currentPage, goToNextPage, goToPreviousPage, isFirstPage, isLastPage, pageSize } =
    usePagination({
      pageSize: 10,
      totalItems: criteria.length,
    });

  const paginatedCriteria = criteria.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setCriteria = (criteria: FormSchema['criteria']) =>
    form.setValue('criteria', criteria, { shouldDirty: true });

  const { append, remove } = stateActionsOf(criteria, setCriteria, arrayActionsOf);

  const [index, setIndex] = useState<number>(0);
  const getNextTempId = useTemporaryId();

  return (
    <Dialog>
      <div className='flex flex-col'>
        <DialogTrigger asChild onClick={() => setIndex(criteria.length)}>
          <Button
            onClick={() =>
              append({
                id: getNextTempId(),
                name: `Criterion ${criteria.length + 1}`,
                description: '',
              })
            }
            type='button'
            className='self-end'
          >
            <Plus />
          </Button>
        </DialogTrigger>

        <ul className='mt-2 mb-2 flex flex-col rounded-md px-2 py-1.5 outline'>
          {criteria.length === 0 ? (
            <h1 className='text-center text-sm'>No Data</h1>
          ) : (
            paginatedCriteria.map((field, index) => (
              <li key={field.id}>
                <DialogTrigger asChild onClick={() => setIndex(index)}>
                  <div className='hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-3 rounded-md px-3.5 py-2 hover:cursor-pointer hover:underline hover:underline-offset-3'>
                    <span className='text-sm'>{field.name}</span>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                      type='button'
                      variant='destructive'
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </DialogTrigger>
                {index !== criteria.length - 1 && <hr />}
              </li>
            ))
          )}
        </ul>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationButtonPrevious disabled={isFirstPage} onClick={() => goToPreviousPage()} />
            </PaginationItem>

            <PaginationItem>
              <PaginationButtonNext disabled={isLastPage} onClick={() => goToNextPage()} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <DialogContent className='top-[35%] sm:max-w-[425px]' aria-describedby=''>
        <DialogHeader>
          <DialogTitle>Edit Criterion</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={`criteria.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`criteria.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className='h-24' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

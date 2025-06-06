import { type UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { stateActionsOf } from '@/view/utils/stateActionsOf';
import { useTemporaryId } from '@/hooks/useTemporaryId';
import { arrayActionsOf } from '@/view/utils/arrayActionsOf';
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import {
  Pagination,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationContent,
  PaginationItem,
} from '@/components/atoms/pagination';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { type RatedCriterion } from '@/view/domain/RatedCriterion';
import { Slider } from '@/components/atoms/slider';
import { RatedCriterionValue } from '@/view/domain/RatedCriterionValue';
import { stepBy } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import { type FormSchema } from '@/view/form.schema';

import { CriteriaDropdownMenu } from '../molecules/CriteriaDropdownMenu';
import { SlidersDialog } from '../sections/SlidersDialog';
import { CriterionItem } from '../molecules/CriterionItem';

type AlternativesFormProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

export function AlternativesForm({ form }: AlternativesFormProps) {
  const alternatives = form.watch('alternatives');

  const { currentPage, goToNextPage, goToPreviousPage, isFirstPage, isLastPage, pageSize } =
    usePagination({
      pageSize: 10,
      totalItems: alternatives.length,
    });

  const paginatedAlternatives = alternatives.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const setAlternatives = (alternatives: FormSchema['alternatives']) =>
    form.setValue('alternatives', alternatives, { shouldDirty: true });

  const { append, remove } = stateActionsOf(alternatives, setAlternatives, arrayActionsOf);

  const [index, setIndex] = useState<number>(0);

  const getNextTempId = useTemporaryId();

  return (
    <Dialog>
      <div className='flex flex-col space-y-4'>
        <DialogTrigger asChild onClick={() => setIndex(alternatives.length)}>
          <Button
            onClick={() =>
              append({
                id: getNextTempId(),
                name: `Alternative ${alternatives.length + 1}`,
                description: '',
                ratedCriteria: [],
              })
            }
            type='button'
            className='self-end'
          >
            <Plus />
          </Button>
        </DialogTrigger>

        {alternatives.length === 0 ? (
          <h1 className='text-muted-foreground py-8 text-center'>No alternatives added yet.</h1>
        ) : (
          <>
            <ul className='flex flex-col rounded-md px-2 py-1.5 outline'>
              {paginatedAlternatives.map((field, index) => (
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
                  {index !== paginatedAlternatives.length - 1 && <hr />}
                </li>
              ))}
            </ul>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationButtonPrevious
                    disabled={isFirstPage}
                    onClick={() => goToPreviousPage()}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationButtonNext disabled={isLastPage} onClick={() => goToNextPage()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>

      <SlidersDialog>
        <DialogHeader>
          <DialogTitle>Edit Alternative</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={`alternatives.${index}.name`}
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
          name={`alternatives.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className='h-24' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <RatedCriteriaForm alternativeIndex={index} form={form} />
      </SlidersDialog>
    </Dialog>
  );
}

type RatedCriteriaFormProps = Readonly<{
  alternativeIndex: number;
  form: UseFormReturn<FormSchema>;
}>;

function RatedCriteriaForm({ alternativeIndex, form }: RatedCriteriaFormProps) {
  const name = `alternatives.${alternativeIndex}.ratedCriteria` as const;

  const criteria = form.watch('criteria');

  const ratedCriteria = form.watch(name);
  const setRatedCriteria = (ratedCriterion: RatedCriterion[]) =>
    form.setValue(name, ratedCriterion, { shouldDirty: true });

  const { append, remove } = stateActionsOf(ratedCriteria, setRatedCriteria, arrayActionsOf);

  const getNextTempId = useTemporaryId();

  return (
    <>
      <ul className='space-y-4'>
        {ratedCriteria.map((ratedCriterion, index) => (
          <CriterionItem
            key={ratedCriterion.id}
            name={ratedCriterion.criterion.name}
            onDelete={() => remove(index)}
            value={ratedCriterion.value}
            maxFractionDigits={RatedCriterionValue.MAX_FRACTION_DIGITS}
            components={{
              Slider: (
                <FormField
                  control={form.control}
                  name={`${name}.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Slider
                          {...field}
                          value={[field.value]}
                          min={RatedCriterionValue.MIN}
                          max={RatedCriterionValue.MAX}
                          step={stepBy(RatedCriterionValue.MAX_FRACTION_DIGITS)}
                          onValueChange={([newValue]) => field.onChange(newValue)}
                          className='w-32 min-[400px]:w-48 min-[475px]:w-64'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ),
            }}
          />
        ))}
      </ul>
      <div className='mt-3.5 flex items-center justify-between'>
        <CriteriaDropdownMenu
          text='Add Rated Criterion'
          criteria={criteria}
          isAllCriteriaSelected={criteria.length === ratedCriteria.length}
          isCriteriaSelected={(criterion) =>
            ratedCriteria.some((w) => w.criterion.id === criterion.id)
          }
          onAllCriteriaSelected={() => {
            setRatedCriteria([
              ...ratedCriteria,
              ...criteria
                .filter((criterion) => !ratedCriteria.some((w) => w.criterion.id === criterion.id))
                .map((criterion) => ({
                  id: getNextTempId(),
                  criterion,
                  value: 0,
                })),
            ]);
          }}
          onCriteriaSelected={(criterion) => {
            append({
              id: getNextTempId(),
              criterion,
              value: 0,
            });
          }}
        />
      </div>
    </>
  );
}

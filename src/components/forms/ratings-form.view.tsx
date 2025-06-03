import { type UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  Dialog,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import { arrayActionsOf } from '@/view/utils/arrayActionsOf';
import { Slider } from '@/components/atoms/slider';
import { type Weight } from '@/view/domain/Weight';
import * as Weights from '@/view/domain/Weights';
import { WeightValue } from '@/view/domain/WeightValue';
import { stateActionsOf } from '@/view/utils/stateActionsOf';
import { stepBy } from '@/lib/utils';
import { DataTable, DataTableColumnHeader } from '@/components/atoms/data-table';
import { Switch } from '@/components/atoms/switch';
import { Label } from '@/components/atoms/label';
import { useTemporaryId } from '@/hooks/useTemporaryId';
import { Button } from '@/components/atoms/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Textarea } from '@/components/atoms/textarea';
import { type RatedCriterion } from '@/view/domain/RatedCriterion';
import { Input } from '@/components/atoms/input';
import { usePagination } from '@/hooks/usePagination';
import {
  Pagination,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationContent,
  PaginationItem,
} from '@/components/atoms/pagination';
import { type FormSchema } from '@/view/form.schema';

import { CriteriaDropdownMenu } from '../molecules/CriteriaDropdownMenu';
import { SlidersDialog } from '../sections/SlidersDialog';
import { CriterionItem } from '../molecules/CriterionItem';

type RatingsFormProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

export function RatingsForm({ form }: RatingsFormProps) {
  const ratings = form.watch('ratings');

  const { currentPage, goToNextPage, goToPreviousPage, isFirstPage, isLastPage, pageSize } =
    usePagination({
      pageSize: 10,
      totalItems: ratings.length,
    });

  const paginatedRatings = ratings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setRatings = (ratings: FormSchema['ratings']) =>
    form.setValue('ratings', ratings, { shouldDirty: true });

  const { append, remove } = stateActionsOf(ratings, setRatings, arrayActionsOf);

  const [index, setIndex] = useState(0);

  const [showTable, setShowTable] = useState(true);

  const getNextTempId = useTemporaryId();

  return (
    <Dialog>
      <div className='flex flex-col space-y-4'>
        <div className='flex items-center space-x-2 self-end'>
          <div className='flex items-center space-x-2'>
            <Switch checked={showTable} onCheckedChange={setShowTable} id='view-mode' />
            <Label htmlFor='view-mode'>Show Table</Label>
          </div>
          <DialogTrigger asChild onClick={() => setIndex(ratings.length)}>
            <Button
              onClick={() =>
                append({
                  id: getNextTempId(),
                  name: `Rating ${ratings.length + 1}`,
                  description: '',
                  weights: [],
                })
              }
              type='button'
            >
              <Plus />
            </Button>
          </DialogTrigger>
        </div>

        {ratings.length === 0 ? (
          <h1 className='text-muted-foreground py-8 text-center'>No rating added yet.</h1>
        ) : (
          <>
            {showTable ? (
              <RatingsTable form={form} />
            ) : (
              <>
                <ul className='mt-2 mb-2 flex flex-col rounded-md px-2 py-1.5 outline'>
                  {paginatedRatings.map((field, index) => (
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
                      {index !== paginatedRatings.length - 1 && <hr />}
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
          </>
        )}
      </div>
      <DialogPortal>
        <SlidersDialog>
          <DialogHeader>
            <DialogTitle>Edit Rating</DialogTitle>
          </DialogHeader>
          <FormField
            control={form.control}
            name={`ratings.${index}.name`}
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
            name={`ratings.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className='h-24' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <WeightsForm form={form} ratingIndex={index} />
        </SlidersDialog>
      </DialogPortal>
    </Dialog>
  );
}

type RatingViewProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

const weightCriteria = (ratedCriteria: RatedCriterion[], weights: Weight[]): number =>
  ratedCriteria.reduce((acc, ratedCriterion) => {
    const weight = weights.find((w) => w.criterion.id === ratedCriterion.criterion.id)?.value;

    if (!weight) return acc;

    return acc + (ratedCriterion.value * weight) / 100;
  }, 0);

function RatingsTable({ form }: RatingViewProps) {
  const criteria = form.watch('criteria');
  const ratings = form.watch('ratings');
  const alternatives = form.watch('alternatives');

  return (
    <DataTable<Record<string, string>, unknown>
      columns={[
        {
          accessorKey: 'alternative',
          header: 'Alternative',
        },
        ...(ratings.map((r) => ({
          accessorKey: r.name,
          sortingFn: (a, b) => Number(a.getValue(r.name)) - Number(b.getValue(r.name)),
          header: ({ column }) => <DataTableColumnHeader column={column} title={r.name} />,
        })) satisfies ColumnDef<Record<string, string>>[]),
        ...(criteria.map((c) => ({
          accessorKey: c.name,
          header: ({ column }) => <DataTableColumnHeader column={column} title={c.name} />,
        })) satisfies ColumnDef<Record<string, string>>[]),
      ]}
      data={alternatives.map((a) => ({
        alternative: a.name,
        ...ratings.reduce(
          (acc, r) => ({
            ...acc,
            [r.name]: weightCriteria(a.ratedCriteria, r.weights).toFixed(1),
          }),
          {},
        ),
        ...a.ratedCriteria.reduce((acc, r) => ({ ...acc, [r.criterion.name]: r.value }), {}),
      }))}
      pagination={{
        size: 'sm',
      }}
    />
  );
}

type WeightsFormProps = Readonly<{
  form: UseFormReturn<FormSchema>;
  ratingIndex: number;
}>;

function WeightsForm({ form, ratingIndex }: WeightsFormProps) {
  const name = `ratings.${ratingIndex}.weights` as const;

  const weights = form.watch(name);
  const setWeights = (weights: Weight[]) => form.setValue(name, weights, { shouldDirty: true });

  const viewModel = {
    actions: stateActionsOf(weights, setWeights, Weights.actions),
    values: {
      total: Weights.total(weights),
    },
  };

  const criteria = form.watch('criteria');

  const getNextTempId = useTemporaryId();

  return (
    <>
      <ul className='max-h-60 space-y-4 overflow-y-auto'>
        {weights.map((weight, index) => (
          <CriterionItem
            key={weight.id}
            name={weight.criterion.name}
            onDelete={() => viewModel.actions.remove(index)}
            value={weight.value}
            maxFractionDigits={WeightValue.MAX_FRACTION_DIGITS}
            components={{
              Slider: (
                <FormField
                  control={form.control}
                  name={`${name}.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Slider
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={[field.value]}
                          min={WeightValue.MIN}
                          max={WeightValue.MAX}
                          step={stepBy(WeightValue.MAX_FRACTION_DIGITS)}
                          onValueChange={([newValue]) =>
                            viewModel.actions.changeValue(weight, newValue!)
                          }
                          onValueCommit={() => viewModel.actions.fixTotal()}
                          disabled={weights.length === 1}
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
          text='Add Weight'
          criteria={criteria}
          isAllCriteriaSelected={criteria.length === weights.length}
          isCriteriaSelected={(criterion) => weights.some((w) => w.criterion.id === criterion.id)}
          onAllCriteriaSelected={() =>
            setWeights([
              ...weights,
              ...criteria
                .filter((criterion) => !weights.some((w) => w.criterion.id === criterion.id))
                .map((criterion) => ({
                  id: getNextTempId(),
                  criterion,
                  value: 0,
                })),
            ])
          }
          onCriteriaSelected={(criterion) =>
            viewModel.actions.addNew({
              id: getNextTempId(),
              criterion,
              value: weights.length === 0 ? WeightValue.MAX : WeightValue.MIN,
            })
          }
        />

        <Button type='button' variant='outline' onClick={() => viewModel.actions.fixTotal()}>
          Total is {viewModel.values.total.toFixed(WeightValue.MAX_FRACTION_DIGITS)} - Fix?
        </Button>
      </div>
    </>
  );
}

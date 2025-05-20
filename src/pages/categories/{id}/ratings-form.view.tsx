import { type UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
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

import { type FormSchema } from './form.view';

type RatingsFormProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

export function RatingsForm({ form }: RatingsFormProps) {
  const ratings = form.watch('ratings');

  const setRatings = (ratings: FormSchema['ratings']) =>
    form.setValue('ratings', ratings, { shouldDirty: true });

  const { append, remove } = stateActionsOf(ratings, setRatings, arrayActionsOf);

  const [index, setIndex] = useState(0);

  const [showTable, setShowTable] = useState(true);

  const getNextTempId = useTemporaryId();

  return (
    <Dialog>
      <div className='flex flex-col'>
        <div className='mb-2 flex items-center space-x-2 self-end'>
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

        {showTable ? (
          <RatingsTable form={form} />
        ) : (
          <ul className='mt-2 mb-2 flex flex-col rounded-md px-2 py-1.5 outline'>
            {ratings.length === 0 ? (
              <h1 className='text-center text-sm'>No Data</h1>
            ) : (
              ratings.map((field, index) => (
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
                  {index !== ratings.length - 1 && <hr />}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <DialogPortal>
        <DialogContent scrollable className='sm:max-w-[600px]' aria-describedby=''>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button'>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

type RatingViewProps = Readonly<{
  form: UseFormReturn<FormSchema>;
}>;

const weightCriteria = (ratedCriteria: RatedCriterion[], weights: Weight[]): number =>
  ratedCriteria.reduce((acc, ratedCriterion) => {
    const weight = weights.find((w) => w.criterionId === ratedCriterion.criterionId)?.value;

    if (!weight) return acc;

    return acc + (ratedCriterion.value * weight) / 100;
  }, 0);

function RatingsTable({ form }: RatingViewProps) {
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
      ]}
      data={alternatives.map((a) => ({
        alternative: a.name,
        ...Object.fromEntries(
          ratings.map((r) => [r.name, weightCriteria(a.ratedCriteria, r.weights).toFixed(1)]),
        ),
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
      <ul className='space-y-4'>
        {weights.map((weight, index) => (
          <li key={weight.id} className='weight-130 flex items-center justify-between'>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-sm'>
                {criteria.find((c) => c.id === weight.criterionId)?.name}
              </span>

              <Button
                type='button'
                variant='destructive'
                onClick={() => viewModel.actions.remove(index)}
              >
                <Trash2 />
              </Button>
            </div>

            <div className='flex items-center space-x-3'>
              <span>{weight.value.toFixed(WeightValue.MAX_FRACTION_DIGITS)}</span>

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
                        className='w-64'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className='mt-3.5 flex items-center justify-between'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type='button'
              variant='secondary'
              className='bg-gray-500 text-white hover:bg-gray-600'
            >
              Add Weight
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {criteria.length === 0 ? (
              <h1 className='text-center text-sm'>No criteria defined</h1>
            ) : (
              criteria.map((criterion) => (
                <DropdownMenuItem
                  key={criterion.id}
                  onClick={() =>
                    viewModel.actions.addNew({
                      id: getNextTempId(),
                      criterionId: criterion.id,
                      value: weights.length === 0 ? WeightValue.MAX : WeightValue.MIN,
                    })
                  }
                  disabled={weights.some((w) => w.criterionId === criterion.id)}
                >
                  {criterion.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type='button' variant='outline' onClick={() => viewModel.actions.fixTotal()}>
          Total is {viewModel.values.total.toFixed(WeightValue.MAX_FRACTION_DIGITS)} - Fix?
        </Button>
      </div>
    </>
  );
}

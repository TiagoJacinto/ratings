import { Button } from '@/components/atoms/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Slider } from '@/components/atoms/slider';
import { Textarea } from '@/components/atoms/textarea';
import { type StateSetter } from '@/shared/view/State';
import { type Weight, WeightSchema } from '@/view/domain/Weight';
import * as Weights from '@/view/domain/Weights';
import { WeightValue } from '@/view/domain/WeightValue';
import { stateActionsOf } from '@/view/utils/stateActionsOf';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type Control, type SubmitHandler, useForm } from 'react-hook-form';
import { useBeforeUnload } from 'react-router';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  weights: z.array(WeightSchema),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = Readonly<{
  onSubmit: SubmitHandler<{
    name: string;
    description?: string;
    weights: {
      name: string;
      value: number;
    }[];
  }>;
}>;

export function CreateRatingForm({ onSubmit }: Props) {
  useBeforeUnload((e) => {
    if (form.formState.isDirty && !form.formState.isSubmitSuccessful) {
      e.preventDefault();
    }
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      name: '',
      weights: [],
    },
    resolver: zodResolver(formSchema),
  });

  const weights = form.watch('weights');

  const setWeights = (weights: FormSchema['weights']) =>
    form.setValue('weights', weights, { shouldDirty: true });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-200'>
        <div className='mt-2 mb-2 flex flex-col gap-y-3'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description:</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder='Description' />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type='submit' className='self-end'>
            Save Rating
          </Button>

          <WeightsForm control={form.control} weights={weights} setWeights={setWeights} />
        </div>
      </form>
    </Form>
  );
}

type WeightsProps = Readonly<{
  control: Control<FormSchema>;
  setWeights: StateSetter<Weight[]>;
  weights: Weight[];
}>;

const stepBy = (fractionDigits: number) => +`0.${'0'.repeat(fractionDigits - 1)}1`;

function WeightsForm({ control, setWeights, weights }: WeightsProps) {
  const viewModel = {
    actions: stateActionsOf(weights, setWeights, Weights.actions),
    values: {
      total: Weights.total(weights),
    },
  };

  return (
    <>
      <ul className='space-y-4'>
        {weights.map((weight, index) => (
          <li key={weight.id} className='weight-130 flex items-center justify-between'>
            <div className='flex justify-between'>
              <FormField
                control={control}
                name={`weights.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                control={control}
                name={`weights.${index}.value`}
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
        <Button
          type='button'
          variant='secondary'
          onClick={() =>
            viewModel.actions.addNew({
              id: crypto.randomUUID(),
              name: '',
              value: weights.length === 0 ? WeightValue.MAX : WeightValue.MIN,
            })
          }
          className='bg-gray-500 text-white hover:bg-gray-600'
        >
          Add Weight
        </Button>

        <Button type='button' variant='outline' onClick={() => viewModel.actions.fixTotal()}>
          Total is {viewModel.values.total} - Fix?
        </Button>
      </div>
    </>
  );
}

import { Button } from '@/components/atoms/button';
import { FormControl, FormField, FormItem } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Slider } from '@/components/atoms/slider';
import { type StateSetter } from '@/shared/view/State';
import { type Weight } from '@/view/domain/Weight';
import * as Weights from '@/view/domain/Weights';
import { WeightValue } from '@/view/domain/WeightValue';
import { stateActionsOf } from '@/view/utils/stateActionsOf';
import { Trash2 } from 'lucide-react';
import { type Control } from 'react-hook-form';

type WeightsProps = Readonly<{
  control: Control<{
    readonly weights: Readonly<{
      name: string;
      id: string;
      value: number;
    }>[];
  }>;
  setWeights: StateSetter<Weight[]>;
  weights: Weight[];
}>;

const stepBy = (fractionDigits: number) => +`0.${'0'.repeat(fractionDigits - 1)}1`;

export function WeightsForm({ control, setWeights, weights }: WeightsProps) {
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
          Total is {viewModel.values.total.toFixed(WeightValue.MAX_FRACTION_DIGITS)} - Fix?
        </Button>
      </div>
    </>
  );
}

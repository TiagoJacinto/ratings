import { Button } from '@/components/atoms/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { WeightsForm } from '@/components/sections/WeightsForm';
import { RatingSchema } from '@/view/domain/Rating';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Control, type SubmitHandler, useForm } from 'react-hook-form';
import { useBeforeUnload } from 'react-router';
import { type z } from 'zod';

const formSchema = RatingSchema;

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
            Create Rating
          </Button>

          <WeightsForm
            control={form.control as unknown as Control<Pick<FormSchema, 'weights'>>}
            weights={weights}
            setWeights={setWeights}
          />
        </div>
      </form>
    </Form>
  );
}

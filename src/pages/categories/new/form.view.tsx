import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useBeforeUnload } from 'react-router';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    criteria: z.array(
      z.object({
        name: z.string().min(1, {
          message: 'Name is required',
        }),
        description: z.string().optional(),
      }),
    ),
    description: z.string().optional(),
  })
  .readonly();

type FormSchema = z.infer<typeof formSchema>;

type Props = Readonly<{
  onSubmit: SubmitHandler<FormSchema>;
}>;

export function CreateAlternativeCategoryForm({ onSubmit }: Props) {
  useBeforeUnload((e) => {
    if (form.formState.isDirty && !form.formState.isSubmitSuccessful) {
      e.preventDefault();
    }
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      name: '',
      criteria: [],
    },
    resolver: zodResolver(formSchema),
  });

  const criteria = useFieldArray({
    name: 'criteria',
    control: form.control,
  });

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

          <ul className='mt-3 space-y-4'>
            {criteria.fields.map((criterion, index) => (
              <li key={criterion.id} className='flex w-full justify-between gap-4'>
                <FormField
                  control={form.control}
                  name={`criteria.${index}.name`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
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
                    <FormItem className='w-full'>
                      <FormControl>
                        <Textarea {...field} placeholder='Description' />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type='button' variant='destructive' onClick={() => criteria.remove(index)}>
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>

          <div className='mt-3.5 flex items-center justify-between'>
            <Button
              type='button'
              variant='secondary'
              onClick={() =>
                criteria.append({
                  name: `Criterion ${criteria.fields.length + 1}`,
                })
              }
              className='bg-gray-500 text-white hover:bg-gray-600'
            >
              Add Criterion
            </Button>
          </div>

          <Button type='submit' className='self-end'>
            Create Alternative Category
          </Button>
        </div>
      </form>
    </Form>
  );
}

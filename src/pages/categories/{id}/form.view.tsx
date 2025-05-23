import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useBeforeUnload, useSearchParams } from 'react-router';

import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Textarea } from '@/components/atoms/textarea';
import { H4 } from '@/components/atoms/typography/h4';
import { CriteriaForm } from '@/components/forms/criteria-form.view';
import { RatingsForm } from '@/components/forms/ratings-form.view';
import { AlternativesForm } from '@/components/forms/alternatives-form.view';
import { type FormSchema, formSchema } from '@/view/form.schema';
import { CategoryDeletionConfirmationDialog } from '@/components/sections/CategoryDeletionConfirmationDialog';

type Props = Readonly<{
  onSubmit: SubmitHandler<FormSchema>;
  values: FormSchema;
  onDelete: () => void;
}>;

export function UpdateAlternativeCategoryForm({ onDelete, onSubmit, values }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  useBeforeUnload((e) => {
    if (form.formState.isDirty && !form.formState.isSubmitSuccessful) {
      e.preventDefault();
    }
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-120'>
        <div className='flex items-center justify-between'>
          <H4>Update Alternative Category</H4>

          <div className='flex items-center gap-x-2'>
            <CategoryDeletionConfirmationDialog onConfirm={onDelete} />
            <Button>Save</Button>
          </div>
        </div>

        <Tabs
          value={searchParams.get('tab') ?? 'details'}
          onValueChange={(tab) =>
            setSearchParams({
              tab,
            })
          }
          className='mt-3'
        >
          <TabsList className='w-full'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='criteria'>Criteria</TabsTrigger>
            <TabsTrigger value='ratings'>Ratings</TabsTrigger>
            <TabsTrigger value='alternatives'>Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='mt-2 mb-2 flex flex-col gap-y-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='h-24' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value='criteria' asChild>
            <CriteriaForm form={form} />
          </TabsContent>

          <TabsContent value='ratings'>
            <RatingsForm form={form} />
          </TabsContent>

          <TabsContent value='alternatives'>
            <AlternativesForm form={form} />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

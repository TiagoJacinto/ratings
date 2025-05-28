import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useBeforeUnload, useSearchParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { Form } from '@/components/atoms/form';
import { type FormSchema, formSchema } from '@/view/form.schema';
import { CategoryDeletionConfirmationDialog } from '@/components/sections/CategoryDeletionConfirmationDialog';
import { CategoryTabs } from '@/components/sections/CategoryTabs';
import { H3 } from '@/components/atoms/typography/h3';

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
    <div className='mx-auto w-full max-w-4xl p-6'>
      <H3 className='mb-4'>Update Alternative Category</H3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' asChild>
              <Link to='/'>
                <ArrowLeft />
                Back to Categories
              </Link>
            </Button>

            <div className='flex items-center gap-x-2'>
              <CategoryDeletionConfirmationDialog onConfirm={onDelete} />
              <Button>
                <Save /> Update
              </Button>
            </div>
          </div>

          <CategoryTabs
            value={searchParams.get('tab') ?? 'details'}
            onValueChange={(tab) => setSearchParams({ tab })}
            form={form}
          />
        </form>
      </Form>
    </div>
  );
}

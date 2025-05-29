import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useBeforeUnload, useSearchParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { Form } from '@/components/atoms/form';
import { type FormSchema, formSchema } from '@/view/form.schema';
import { H3 } from '@/components/atoms/typography/h3';
import { CategoryTabs } from '@/components/sections/CategoryTabs';

type Props = Readonly<{
  onSubmit: SubmitHandler<FormSchema>;
}>;

export function CreateAlternativeCategoryForm({ onSubmit }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  useBeforeUnload((e) => {
    if (form.formState.isDirty && !form.formState.isSubmitSuccessful) {
      e.preventDefault();
    }
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      name: '',
      alternatives: [],
      criteria: [],
      description: '',
      ratings: [],
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <div className='mx-auto w-full max-w-4xl p-10'>
      <H3 className='mb-4'>Create Alternative Category</H3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' asChild>
              <Link to='/'>
                <ArrowLeft />
                Back to Categories
              </Link>
            </Button>

            <Button>
              <Save /> Save
            </Button>
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

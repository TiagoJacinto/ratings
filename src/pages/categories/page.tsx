import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/atoms/button';
import { H4 } from '@/components/atoms/typography/h4';
import { useModules } from '@/components/context/ModulesProvider';
import { Query } from '@/components/Query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import { Textarea } from '@/components/atoms/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/atoms/accordion';
import { CategoryDeletionConfirmationDialog } from '@/components/sections/CategoryDeletionConfirmationDialog';
import { type DeleteAlternativeCategoryByIdDTO } from '@/modules/alternatives/use-cases/delete-alternative-category-by-id/delete-alternative-category-by-id..use-case';
import { type ImportAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/import-alternative-category/import-alternative-category.use-case';

const ImportedCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  alternatives: z.array(
    z.object({
      name: z.string().min(1, {
        message: 'Name is required',
      }),
      description: z.string().optional(),
      ratedCriteria: z.array(
        z.object({
          criterionName: z.string().min(1, {
            message: 'Name is required',
          }),
          value: z.number(),
        }),
      ),
    }),
  ),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: 'Name is required',
        }),
        description: z.string().optional(),
      }),
    )
    .optional(),
  description: z.string().optional(),
  ratings: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: 'Name is required',
        }),
        description: z.string().optional(),
        weights: z.array(
          z.object({
            criterionName: z.string().min(1, {
              message: 'Name is required',
            }),
            value: z.number(),
          }),
        ),
      }),
    )
    .optional(),
});

type ImportedCategory = z.infer<typeof ImportedCategorySchema>;

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const { alternatives } = useModules();

  const navigate = useNavigate();

  const { mutate: deleteCategory } = useMutation({
    mutationKey: ['deleteAlternativeCategory'],
    mutationFn: (dto: DeleteAlternativeCategoryByIdDTO) =>
      alternatives.controllers.deleteAlternativeCategory.execute(dto),
    onError: () => toast.error("Couldn't delete the category"),
    onSuccess: async () => {
      toast.success('Category deleted successfully');

      await queryClient.invalidateQueries({
        queryKey: ['getAlternativeCategories'],
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: (dto: ImportAlternativeCategoryDTO) =>
      alternatives.controllers.importAlternativeCategory.execute(dto),
    onError: () => toast.error("Couldn't import the category"),
    onSuccess: (id) => navigate(`/${id}`),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['getAlternativeCategories'],
    queryFn: async () => {
      const categories = await alternatives.repositories.alternativeCategory.findAll();

      return categories;
    },
  });

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <div className='mb-5 flex items-center justify-between border-b pb-2'>
        <h3 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
          Categories
        </h3>

        <div className='flex items-center gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Import</Button>
            </DialogTrigger>

            <DialogContent scrollable>
              <DialogHeader>
                <DialogTitle>Import category</DialogTitle>
              </DialogHeader>

              <ImportCategoryForm handleImport={mutate} />
            </DialogContent>
          </Dialog>

          <Button type='button' asChild>
            <Link to='/new'>
              <Plus />
            </Link>
          </Button>
        </div>
      </div>
      <Query isLoading={isLoading} error={error} data={data}>
        {(categories) => (
          <ul className='space-y-3'>
            {categories.map((category) => (
              <li key={category.name} className='flex items-center justify-between'>
                <H4 className='text-lg text-neutral-700 uppercase'>{category.name}</H4>
                <div className='flex items-center gap-2'>
                  <Button asChild>
                    <Link to={`/${category.id.toValue()}`}>
                      <Edit3 />
                    </Link>
                  </Button>
                  <CategoryDeletionConfirmationDialog
                    onConfirm={() => deleteCategory({ id: category.id.toValue() as number })}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Query>
    </div>
  );
}

const formSchema = z.object({
  unparsedJsonCategoryImport: z.string().min(1, {
    message: 'This field is required',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type ImportCategoryFormProps = Readonly<{
  handleImport: (dto: ImportedCategory) => void;
}>;

function ImportCategoryForm({ handleImport }: ImportCategoryFormProps) {
  const form = useForm<FormSchema>({
    defaultValues: {
      unparsedJsonCategoryImport: '',
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = ({ unparsedJsonCategoryImport }) => {
    try {
      const result = ImportedCategorySchema.safeParse(JSON.parse(unparsedJsonCategoryImport));

      if (!result.success) {
        form.setError('unparsedJsonCategoryImport', {
          message: 'Invalid JSON format',
        });
        return;
      }

      handleImport(result.data);
    } catch {
      form.setError('unparsedJsonCategoryImport', {
        message: 'Invalid JSON',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-120 space-y-4'>
        <FormField
          control={form.control}
          name='unparsedJsonCategoryImport'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category JSON</FormLabel>
              <FormControl>
                <Textarea {...field} className='h-64' />
              </FormControl>
              <FormMessage />
              <Accordion type='single' collapsible className='mt-2'>
                <AccordionItem value='example-json'>
                  <AccordionTrigger className='text-sm underline'>
                    Show JSON Format
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className='overflow-x-auto rounded bg-neutral-100 p-2 text-xs select-all'>
                      {`{
  name: string;
  alternatives?: {
    name: string;
    description?: string;
    ratedCriteria?: { criterionName: string; value: number }[];
  }[];
  criteria?: { name: string; description?: string }[];
  description?: string;
  ratings?: {
    name: string;
    description?: string;
    weights?: { criterionName: string; value: number }[];
  }[];
}`}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </FormItem>
          )}
        />

        <Button type='submit'>Import</Button>
      </form>
    </Form>
  );
}

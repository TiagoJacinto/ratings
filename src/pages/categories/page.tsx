import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Edit3, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

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
import { CategoryDeletionConfirmationDialog } from '@/components/sections/CategoryDeletionConfirmationDialog';
import { type DeleteAlternativeCategoryByIdDTO } from '@/modules/alternatives/use-cases/delete-alternative-category-by-id/delete-alternative-category-by-id..use-case';
import { type ImportAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/import-alternative-category/import-alternative-category.use-case';
import { Card, CardContent } from '@/components/atoms/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';

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
    <div className='mx-auto w-full max-w-4xl p-5 md:p-10'>
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
              <DialogHeader className='text-left'>
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
        {(categories) =>
          categories.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12 sm:py-16'>
                <div className='max-w-md text-center'>
                  <h3 className='mb-2 text-lg font-semibold'>No categories yet</h3>
                  <p className='text-muted-foreground mb-4 text-sm sm:text-base'>
                    Get started by creating your first evaluation category
                  </p>
                  <Link to='/new'>
                    <Button className='w-full sm:w-auto'>
                      <Plus className='mr-2 h-4 w-4' />
                      Create Category
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
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
          )
        }
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

const jsonFormat = `{
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
}`;

function ImportCategoryForm({ handleImport }: ImportCategoryFormProps) {
  const [showFormat, setShowFormat] = useState(false);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full min-w-0 space-y-4'>
        <FormField
          control={form.control}
          name='unparsedJsonCategoryImport'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category JSON</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Paste your category JSON here...'
                  className='h-64 min-h-[200px] w-full font-mono text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Collapsible open={showFormat} onOpenChange={setShowFormat} className='space-y-2'>
          <CollapsibleTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground hover:text-foreground flex h-auto items-center gap-2 p-0 text-sm font-normal'
            >
              {showFormat ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
              JSON Format
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='bg-muted/50 w-full min-w-0 overflow-hidden rounded-md border'>
              <pre
                className='w-full cursor-pointer overflow-x-auto overflow-y-hidden p-3 font-mono text-xs whitespace-pre select-all'
                title='Click to select all'
              >
                {jsonFormat}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button type='submit'>Import</Button>
      </form>
    </Form>
  );
}

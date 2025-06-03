import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { toast } from 'sonner';

import { useModules } from '@/components/context/ModulesProvider';
import { Query } from '@/components/Query';
import { type DeleteAlternativeCategoryByIdDTO } from '@/modules/alternatives/use-cases/delete-alternative-category-by-id/delete-alternative-category-by-id..use-case';
import { type UpdateAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/update-alternative-category/update-alternative-category.use-case';
import { type FormSchema } from '@/view/form.schema';

import { UpdateAlternativeCategoryForm } from './form.view';

export function AlternativeCategoryPage() {
  const modules = useModules();
  const params = useParams();
  const id = z.number({ coerce: true }).parse(params.id);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['getAlternativeCategoryById'],
    queryFn: async () => {
      const category = await modules.alternatives.controllers.getAlternativeCategoryById.execute({
        id,
      });

      const criteria =
        await modules.alternatives.repositories.criterion.findManyByAlternativeCategoryId(id);
      const ratings =
        await modules.ratings.repositories.rating.findManyByAlternativeCategoryIdForUpdate(id);
      const alternatives =
        await modules.alternatives.repositories.alternative.findManyByAlternativeCategoryIdForUpdate(
          id,
        );

      return {
        name: category.name,
        alternatives: alternatives.map((alternative) => ({
          ...alternative.toObject(),
          id: alternative.id.toValue() as number,
          ratedCriteria: alternative.ratedCriteria.map((ratedCriterion) => ({
            id: ratedCriterion.id.toValue() as number,
            criterion: {
              ...ratedCriterion.criterion.toObject(),
              id: ratedCriterion.criterion.id.toValue() as number,
            },
            value: ratedCriterion.value.value,
          })),
        })),
        criteria: criteria.map((criterion) => ({
          id: criterion.id.toValue() as number,
          name: criterion.name,
          description: criterion.description,
        })),
        description: category.description,
        ratings: ratings.map((rating) => ({
          ...rating.toObject(),
          id: rating.id.toValue() as number,
          weights: rating.weights.map((weight) => ({
            id: weight.id.toValue() as number,
            criterion: {
              ...weight.criterion.toObject(),
              id: weight.criterion.id.toValue() as number,
            },
            value: weight.value.value,
          })),
        })),
      } satisfies FormSchema;
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationKey: ['deleteAlternativeCategory'],
    mutationFn: (dto: DeleteAlternativeCategoryByIdDTO) =>
      modules.alternatives.controllers.deleteAlternativeCategory.execute(dto),
    onError: () => toast.error('Error deleting category'),
    onSuccess: async () => {
      toast.success('Category deleted successfully');

      await navigate('/');
    },
  });

  const { mutate } = useMutation({
    mutationFn: (rating: UpdateAlternativeCategoryDTO) =>
      modules.alternatives.controllers.updateAlternativeCategory.execute(rating),
    onError: () => toast.error('Error saving category'),
    onSuccess: async () => {
      toast('Category updated successfully');
      await queryClient.invalidateQueries({
        queryKey: ['getAlternativeCategoryById'],
      });
    },
  });

  return (
    <Query isLoading={isLoading} error={error} data={data}>
      {(category) => (
        <UpdateAlternativeCategoryForm
          values={category}
          onDelete={() => deleteCategory({ id })}
          onSubmit={(data) =>
            mutate({
              id,
              ...data,
              alternatives: data.alternatives.map((alternative) => ({
                ...alternative,
                ratedCriteria: alternative.ratedCriteria.map((rc) => ({
                  id: rc.id,
                  criterionId: rc.criterion.id,
                  value: rc.value,
                })),
              })),
              ratings: data.ratings.map((rating) => ({
                ...rating,
                weights: rating.weights.map((w) => ({
                  id: w.id,
                  criterionId: w.criterion.id,
                  value: w.value,
                })),
              })),
            })
          }
        />
      )}
    </Query>
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { toast } from 'sonner';

import { useModules } from '@/components/context/ModulesProvider';
import { Query } from '@/components/Query';
import { type UpdateAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/update-alternative-category.use-case';
import { type DeleteAlternativeCategoryByIdDTO } from '@/modules/alternatives/use-cases/delete-alternative-category.use-case';

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
      const result = await modules.alternatives.useCases.getAlternativeCategoryById.execute({ id });
      if (!result.isOk) throw result.error;

      const criteria =
        await modules.alternatives.repositories.criterion.findManyByAlternativeCategoryId(id);
      const ratings = await modules.ratings.repositories.rating.findManyByAlternativeCategoryId(id);
      const alternatives =
        await modules.alternatives.repositories.alternative.findManyByAlternativeCategoryId(id);

      return {
        name: result.value.name,
        alternatives: await Promise.all(
          alternatives.map(async (alternative) => ({
            id: alternative.id.toValue() as number,
            name: alternative.name,
            description: alternative.description,
            ratedCriteria: (
              await modules.alternatives.repositories.ratedCriterion.findManyByAlternativeId(
                alternative.id.toValue() as number,
              )
            ).map((ratedCriterion) => ({
              id: ratedCriterion.id.toValue() as number,
              criterionId: ratedCriterion.criterion!.id.toValue() as number,
              value: ratedCriterion.value.value,
            })),
          })),
        ),
        criteria: criteria.map((criterion) => ({
          id: criterion.id.toValue() as number,
          name: criterion.name,
          description: criterion.description,
        })),
        description: result.value.description,
        ratings: await Promise.all(
          ratings.map(async (rating) => ({
            id: rating.id.toValue() as number,
            name: rating.name,
            description: rating.description,
            weights: (
              await modules.ratings.repositories.weight.findManyByRatingId(
                rating.id.toValue() as number,
              )
            ).map((weight) => ({
              id: weight.id.toValue() as number,
              criterionId: weight.criterion!.id.toValue() as number,
              value: weight.value.value,
            })),
          })),
        ),
      };
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationKey: ['deleteAlternativeCategory'],
    mutationFn: (dto: DeleteAlternativeCategoryByIdDTO) =>
      modules.alternatives.useCases.deleteAlternativeCategory.execute(dto),
    onError: () => toast.error('Error deleting category'),
    onSuccess: async () => {
      toast.success('Category deleted successfully');

      await navigate('/');
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: (rating: UpdateAlternativeCategoryDTO) =>
      modules.alternatives.useCases.updateAlternativeCategory.execute(rating),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['getAlternativeCategoryById'],
      }),
  });

  return (
    <Query isLoading={isLoading} error={error} data={data}>
      {(category) => (
        <UpdateAlternativeCategoryForm
          defaultValues={category}
          onDelete={() => deleteCategory({ id })}
          onSubmit={async (data) => {
            const result = await mutateAsync({ id, ...data });

            if (!result.isOk) return;

            toast('Category saved successfully');
          }}
        />
      )}
    </Query>
  );
}

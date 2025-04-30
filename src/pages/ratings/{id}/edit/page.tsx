import { useModules } from '@/components/context/ModulesProvider';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { type UpdateRatingDTO } from '@/modules/ratings/use-cases/updateRating.use-case';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { type Rating } from '@/view/domain/Rating';

import { UpdateRatingForm } from './form.view';

export function UpdateRatingPage() {
  const { ratings } = useModules();
  const params = useParams();
  const id = z.number({ coerce: true }).parse(params.id);

  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: (rating: UpdateRatingDTO) => ratings.useCases.updateRating.execute(rating),
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getRatingById'],
    queryFn: async () => {
      const result = await ratings.useCases.getRatingById.execute({ id });

      if (!result.isOk) throw result.error;

      return result.value;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;
  if (!data) return <p>Data not found</p>;

  const rating: Rating = {
    name: data.name,
    description: data.description,
    weights: data.weights.getItems().map((weight) => ({
      id: crypto.randomUUID(),
      name: weight.name,
      value: weight.value.value,
    })),
  };

  return (
    <UpdateRatingForm
      defaultValues={rating}
      onSubmit={async (data) => {
        const result = await mutateAsync({ id, ...data });

        if (!result.isOk) {
          return;
        }

        await navigate(`/ratings/${id}`);
      }}
    />
  );
}

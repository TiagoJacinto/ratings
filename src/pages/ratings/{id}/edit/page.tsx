import { useModules } from '@/components/context/ModulesProvider';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { type UpdateRatingDTO } from '@/modules/ratings/use-cases/updateRating.use-case';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Query } from '@/components/Query';

import { UpdateRatingForm } from './form.view';

export function UpdateRatingPage() {
  const { ratings } = useModules();
  const params = useParams();
  const id = z.number({ coerce: true }).parse(params.id);

  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: (rating: UpdateRatingDTO) => ratings.useCases.updateRating.execute(rating),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['getRatingById'],
    queryFn: async () => {
      const result = await ratings.useCases.getRatingById.execute({ id });

      if (!result.isOk) throw result.error;

      return result.value;
    },
  });

  return (
    <Query isLoading={isLoading} error={error} data={data}>
      {(rating) => (
        <UpdateRatingForm
          defaultValues={{
            name: rating.name,
            description: rating.description,
            weights: rating.weights.getItems().map((weight) => ({
              id: crypto.randomUUID(),
              name: weight.name,
              value: weight.value.value,
            })),
          }}
          onSubmit={async (data) => {
            const result = await mutateAsync({ id, ...data });

            if (!result.isOk) {
              return;
            }

            await navigate(`/ratings/${id}`);
          }}
        />
      )}
    </Query>
  );
}

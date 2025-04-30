import { useUseCases } from '@/components/context/UseCasesProvider';
import { type CreateRatingDTO } from '@/modules/ratings/use-cases/createRating.use-case';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { CreateRatingForm } from './form.view';

export function CreateRatingPage() {
  const { createRatingUseCase } = useUseCases();

  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: (rating: CreateRatingDTO) => createRatingUseCase.execute(rating),
  });

  return (
    <CreateRatingForm
      onSubmit={async (data) => {
        const result = await mutateAsync(data);

        if (!result.isOk) {
          return;
        }

        await navigate(`/ratings/${result.value}/edit`);
      }}
    />
  );
}

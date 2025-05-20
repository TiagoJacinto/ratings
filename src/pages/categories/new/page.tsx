import { useModules } from '@/components/context/ModulesProvider';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { type CreateAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/create-alternative-category.use-case';

import { CreateAlternativeCategoryForm } from './form.view';

export function CreateAlternativeCategoryPage() {
  const { alternatives } = useModules();

  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: (dto: CreateAlternativeCategoryDTO) =>
      alternatives.useCases.createAlternativeCategory.execute(dto),
  });

  return (
    <CreateAlternativeCategoryForm
      onSubmit={async (data) => {
        const result = await mutateAsync(data);

        if (!result.isOk) {
          return;
        }

        await navigate(`/categories/${result.value}`);
      }}
    />
  );
}

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useModules } from '@/components/context/ModulesProvider';
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
          toast.error("Couldn't create the alternative category");
          return;
        }

        await navigate(`/${result.value}`);
      }}
    />
  );
}

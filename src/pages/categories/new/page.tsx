import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useModules } from '@/components/context/ModulesProvider';
import { type CreateAlternativeCategoryDTO } from '@/modules/alternatives/use-cases/create-alternative-category/create-alternative-category.use-case';
import { AlternativeCategoryMapper } from '@/view/mappers/AlternativeCategoryMapper';

import { CreateAlternativeCategoryForm } from './form.view';

export function CreateAlternativeCategoryPage() {
  const { alternatives } = useModules();

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (dto: CreateAlternativeCategoryDTO) =>
      alternatives.controllers.createAlternativeCategory.execute(dto),
    onError: () => toast.error("Couldn't create the category"),
    onSuccess: (id) => navigate(`/${id}`),
  });

  return (
    <CreateAlternativeCategoryForm
      onSubmit={(data) => mutate(AlternativeCategoryMapper.toDTO(data))}
    />
  );
}

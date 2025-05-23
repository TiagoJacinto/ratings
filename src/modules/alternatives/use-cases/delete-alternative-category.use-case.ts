import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';

import { type AlternativeCategoryRepository } from '../repositories/alternative-category/alternative-category.repository';

export type DeleteAlternativeCategoryByIdDTO = {
  id: number;
};

type Response = Result<undefined, Error>;

export class DeleteAlternativeCategoryByIdUseCase
  implements UseCase<DeleteAlternativeCategoryByIdDTO, Response>
{
  constructor(private readonly alternativeCategoryRepository: AlternativeCategoryRepository) {}

  async execute({ id }: DeleteAlternativeCategoryByIdDTO): Promise<Response> {
    const exists = await this.alternativeCategoryRepository.existsById(id);

    if (!exists) {
      return err(new Error(`AlternativeCategory with id: ${id} was not found`));
    }

    await this.alternativeCategoryRepository.deleteById(id);

    return ok();
  }
}

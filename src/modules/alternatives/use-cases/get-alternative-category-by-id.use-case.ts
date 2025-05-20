import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';

import { type AlternativeCategory } from '../domain/AlternativeCategory';
import { type AlternativeCategoryRepository } from '../repositories/alternative-category/alternative-category.repository';

export type GetAlternativeCategoryByIdDTO = {
  id: number;
};

type Response = Result<AlternativeCategory, Error>;

export class GetAlternativeCategoryByIdUseCase
  implements UseCase<GetAlternativeCategoryByIdDTO, Response>
{
  constructor(private readonly alternativeCategoryRepository: AlternativeCategoryRepository) {}

  async execute({ id }: GetAlternativeCategoryByIdDTO): Promise<Response> {
    const alternativeCategory = await this.alternativeCategoryRepository.findById(id);

    if (!alternativeCategory) {
      return err(new Error(`AlternativeCategory with id: ${id} was not found`));
    }

    return ok(alternativeCategory);
  }
}

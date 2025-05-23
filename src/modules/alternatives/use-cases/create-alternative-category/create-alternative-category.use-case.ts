import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { type AlternativeCategoryRepository } from '../../repositories/alternative-category/alternative-category.repository';
import { AlternativeCategory } from '../../domain/AlternativeCategory';

export type CreateAlternativeCategoryDTO = {
  name: string;
  description?: string;
};

type Response = Result<number, Error>;

export class CreateAlternativeCategoryUseCase
  implements UseCase<CreateAlternativeCategoryDTO, Response>
{
  constructor(private readonly alternativeCategoryRepository: AlternativeCategoryRepository) {}

  async execute(request: CreateAlternativeCategoryDTO): Promise<Response> {
    const exists = await this.alternativeCategoryRepository.existsByName(request.name);

    if (exists)
      return err(new Error(`Alternative category with name: ${request.name} already exists`));

    return ok(
      await this.alternativeCategoryRepository.save(
        AlternativeCategory.create(
          {
            name: request.name,

            description: request.description,
          },
          new UniqueEntityID(),
        ),
      ),
    );
  }
}

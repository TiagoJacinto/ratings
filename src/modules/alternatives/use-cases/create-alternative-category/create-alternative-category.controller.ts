import {
  type CreateAlternativeCategoryDTO,
  type CreateAlternativeCategoryUseCase,
} from './create-alternative-category.use-case';

export class CreateAlternativeCategoryController {
  constructor(
    private readonly createAlternativeCategoryUseCase: CreateAlternativeCategoryUseCase,
  ) {}

  async execute(dto: CreateAlternativeCategoryDTO) {
    const result = await this.createAlternativeCategoryUseCase.execute(dto);
    return result.getOrThrow();
  }
}

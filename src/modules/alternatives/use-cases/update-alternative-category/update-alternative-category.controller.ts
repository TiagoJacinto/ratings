import {
  type UpdateAlternativeCategoryDTO,
  type UpdateAlternativeCategoryUseCase,
} from './update-alternative-category.use-case';

export class UpdateAlternativeCategoryController {
  constructor(
    private readonly updateAlternativeCategoryUseCase: UpdateAlternativeCategoryUseCase,
  ) {}

  async execute(dto: UpdateAlternativeCategoryDTO) {
    const result = await this.updateAlternativeCategoryUseCase.execute(dto);
    return result.getOrThrow();
  }
}

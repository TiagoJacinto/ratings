import {
  type DeleteAlternativeCategoryByIdDTO,
  type DeleteAlternativeCategoryByIdUseCase,
} from './delete-alternative-category-by-id..use-case';

export class DeleteAlternativeCategoryController {
  constructor(
    private readonly deleteAlternativeCategoryUseCase: DeleteAlternativeCategoryByIdUseCase,
  ) {}

  async execute(dto: DeleteAlternativeCategoryByIdDTO) {
    const result = await this.deleteAlternativeCategoryUseCase.execute(dto);
    return result.getOrThrow();
  }
}

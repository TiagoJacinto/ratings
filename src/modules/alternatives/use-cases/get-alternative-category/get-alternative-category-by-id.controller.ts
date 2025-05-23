import {
  type GetAlternativeCategoryByIdDTO,
  type GetAlternativeCategoryByIdUseCase,
} from './get-alternative-category-by-id.use-case';

export class GetAlternativeCategoryController {
  constructor(private readonly getAlternativeCategoryUseCase: GetAlternativeCategoryByIdUseCase) {}

  async execute(dto: GetAlternativeCategoryByIdDTO) {
    const result = await this.getAlternativeCategoryUseCase.execute(dto);
    return result.getOrThrow();
  }
}

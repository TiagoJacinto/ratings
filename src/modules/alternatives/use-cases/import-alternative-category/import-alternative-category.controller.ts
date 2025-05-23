import {
  type ImportAlternativeCategoryDTO,
  type ImportAlternativeCategoryUseCase,
} from './import-alternative-category.use-case';

export class ImportAlternativeCategoryController {
  constructor(
    private readonly importAlternativeCategoryUseCase: ImportAlternativeCategoryUseCase,
  ) {}

  async execute(dto: ImportAlternativeCategoryDTO) {
    const result = await this.importAlternativeCategoryUseCase.execute(dto);
    return result.getOrThrow();
  }
}

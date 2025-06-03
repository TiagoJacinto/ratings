import { type AlternativeCategory } from '../domain/AlternativeCategory';

export class AlternativeCategoryMapper {
  static toDTO(category: AlternativeCategory) {
    return {
      ...category,
      alternatives: category.alternatives.map((alternative) => ({
        ...alternative,
        ratedCriteria: alternative.ratedCriteria.map((rc) => ({
          id: rc.id,
          criterionId: rc.criterion.id,
          value: rc.value,
        })),
      })),
      ratings: category.ratings.map((rating) => ({
        ...rating,
        weights: rating.weights.map((w) => ({
          id: w.id,
          criterionId: w.criterion.id,
          value: w.value,
        })),
      })),
    };
  }
}

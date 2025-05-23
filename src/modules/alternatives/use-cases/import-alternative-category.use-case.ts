import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { Rating } from '@/modules/ratings/domain/Rating';
import { WeightValue } from '@/modules/ratings/domain/WeightValue';
import { Weight } from '@/modules/ratings/domain/Weight';

import { type AlternativeCategoryRepository } from '../repositories/alternative-category/alternative-category.repository';
import { AlternativeCategory } from '../domain/AlternativeCategory';
import { Alternative } from '../domain/Alternative';
import { Criterion } from '../domain/Criterion';
import { RatedCriterion } from '../domain/RatedCriterion';
import { type CriterionRepository } from '../repositories/criterion/criterion.repository';
import { RatedCriterionValue } from '../domain/RatedCriterionValue';

export type ImportAlternativeCategoryDTO = {
  name: string;
  alternatives?: {
    name: string;
    description?: string;
    ratedCriteria?: { criterionName: string; value: number }[];
  }[];
  criteria?: { name: string; description?: string }[];
  description?: string;
  ratings?: {
    name: string;
    description?: string;
    weights?: { criterionName: string; value: number }[];
  }[];
};

type Response = Result<number, Error>;

export class ImportAlternativeCategoryUseCase
  implements UseCase<ImportAlternativeCategoryDTO, Response>
{
  constructor(
    private readonly alternativeCategoryRepository: AlternativeCategoryRepository,
    private readonly criterionRepository: CriterionRepository,
  ) {}

  async execute(request: ImportAlternativeCategoryDTO): Promise<Response> {
    const exists = await this.alternativeCategoryRepository.existsByName(request.name);

    if (exists)
      return err(new Error(`Alternative category with name: ${request.name} already exists`));

    const criterionMap = new Map<string, Criterion>();

    if (request.criteria) {
      for (const c of request.criteria) {
        const id = await this.criterionRepository.save(
          Criterion.create(
            {
              name: c.name,
              description: c.description,
            },
            new UniqueEntityID(),
          ),
        );

        criterionMap.set(c.name, Criterion.create({ name: c.name }, new UniqueEntityID(id)));
      }
    }

    const alternatives = request.alternatives?.map((alternative) => {
      return Alternative.create(
        {
          name: alternative.name,
          description: alternative.description,
          ratedCriteria: alternative.ratedCriteria?.map((ratedCriterion) =>
            RatedCriterion.create({
              criterion: criterionMap.get(ratedCriterion.criterionName)!,
              value: RatedCriterionValue.create({
                value: ratedCriterion.value,
              }).unwrapped,
            }),
          ),
        },
        new UniqueEntityID(),
      );
    });

    const ratings = request.ratings?.map((rating) => {
      return Rating.create(
        {
          name: rating.name,
          description: rating.description,
          weights: rating.weights?.map((weight) => {
            return Weight.create(
              {
                criterion: criterionMap.get(weight.criterionName)!,
                value: WeightValue.create({ value: weight.value }).unwrapped,
              },
              new UniqueEntityID(),
            );
          }),
        },
        new UniqueEntityID(),
      );
    });

    return ok(
      await this.alternativeCategoryRepository.save(
        AlternativeCategory.create(
          {
            name: request.name,
            alternatives,
            criteria: Array.from(criterionMap.values()),
            description: request.description,
            ratings,
          },
          new UniqueEntityID(),
        ),
      ),
    );
  }
}

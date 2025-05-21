import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { Rating } from '@/modules/ratings/domain/Rating';
import { Weight } from '@/modules/ratings/domain/Weight';
import { WeightValue } from '@/modules/ratings/domain/WeightValue';
import { type IdTracker } from '@/modules/shared/services/id-tracker/id-tracker';
import { isTemporaryId } from '@/modules/shared/lib/isTemporaryId';

import { type AlternativeCategoryRepository } from '../repositories/alternative-category/alternative-category.repository';
import { AlternativeCategory } from '../domain/AlternativeCategory';
import { Criterion } from '../domain/Criterion';
import { RatedCriterion } from '../domain/RatedCriterion';
import { RatedCriterionValue } from '../domain/RatedCriterionValue';
import { Alternative } from '../domain/Alternative';

export type UpdateAlternativeCategoryDTO = {
  id: number;
  name: string;
  alternatives: {
    name: string;
    id: number;
    description?: string;
    ratedCriteria: {
      id: number;
      criterionId: number;
      value: number;
    }[];
  }[];
  criteria: {
    name: string;
    id: number;
    description?: string;
  }[];
  description?: string;
  ratings: {
    name: string;
    id: number;
    description?: string;
    weights: {
      id: number;
      criterionId: number;
      value: number;
    }[];
  }[];
};

type Response = Result<number, Error>;

export class UpdateAlternativeCategoryUseCase
  implements UseCase<UpdateAlternativeCategoryDTO, Response>
{
  constructor(
    private readonly alternativeCategoryRepository: AlternativeCategoryRepository,
    private readonly idTracker: IdTracker,
  ) {}

  async execute(request: UpdateAlternativeCategoryDTO): Promise<Response> {
    const alternativeCategory = await this.alternativeCategoryRepository.findById(request.id);

    if (!alternativeCategory)
      return err(new Error(`Alternative category with id: ${request.id} does not exist`));

    const idMap = new Map<number, number>();

    const criteria: Criterion[] = [];
    for (const c of request.criteria) {
      const id = isTemporaryId(c.id) ? await this.idTracker.moveToNextId(Criterion.name) : c.id;
      idMap.set(c.id, id);

      criteria.push(
        Criterion.create(
          {
            name: c.name,
            alternativeCategory,
            description: c.description,
          },
          new UniqueEntityID(id),
        ),
      );
    }

    const alternatives = request.alternatives.map((alternative) => {
      return Alternative.create(
        {
          name: alternative.name,
          alternativeCategory,
          description: alternative.description,
          ratedCriteria: request.criteria.map((criterion) =>
            RatedCriterion.create({
              criterion: Criterion.create(
                {
                  name: criterion.name,
                  alternativeCategory,
                  description: criterion.description,
                },
                new UniqueEntityID(idMap.get(criterion.id)),
              ),
              value: RatedCriterionValue.create({
                value:
                  alternative.ratedCriteria.find((rc) => rc.criterionId === criterion.id)?.value ??
                  0,
              }).unwrapped,
            }),
          ),
        },
        new UniqueEntityID(alternative.id),
      );
    });

    const ratings = request.ratings.map((rating) => {
      return Rating.create(
        {
          name: rating.name,
          alternativeCategory,
          description: rating.description,
          weights: rating.weights.map((w) => {
            const criterion = request.criteria.find((c) => c.id === w.criterionId)!;

            return Weight.create(
              {
                criterion: Criterion.create(
                  {
                    name: criterion.name,
                    alternativeCategory,
                    description: criterion.description,
                  },
                  new UniqueEntityID(idMap.get(criterion.id)),
                ),
                value: WeightValue.create({ value: w.value }).unwrapped,
              },
              new UniqueEntityID(w.id),
            );
          }),
        },
        new UniqueEntityID(rating.id),
      );
    });

    return ok(
      await this.alternativeCategoryRepository.save(
        AlternativeCategory.create(
          {
            name: request.name,
            alternatives,
            criteria,
            description: request.description,
            ratings,
          },
          new UniqueEntityID(request.id),
        ),
      ),
    );
  }
}

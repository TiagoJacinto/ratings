import { Weight } from '@/modules/weights/domain/Weight';
import { Weights } from '@/modules/weights/domain/Weights';
import { WeightValue } from '@/modules/weights/domain/WeightValue';
import { err, ok, Result } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';

import { Rating } from '../domain/Rating';
import { type RatingRepository } from '../repositories/rating/rating.repository';

export type UpdateRatingDTO = {
  id: number;
  name: string;
  description?: string;
  weights: {
    name: string;
    value: number;
  }[];
};

type Response = Result<undefined, Error>;

export class UpdateRatingUseCase implements UseCase<UpdateRatingDTO, Response> {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async execute({ id, name, description, weights }: UpdateRatingDTO): Promise<Response> {
    const exists = await this.ratingRepository.existsById(id);
    if (!exists) return err(new Error(`Rating with id: ${id} does not exist`));

    const weightsOrError = Result.combine(
      weights.map((w) => () => {
        const value = WeightValue.create({ value: w.value });
        if (!value.isOk) return value;

        return ok(
          Weight.create({
            name: w.name,
            value: value.value,
          }),
        );
      }),
    );
    if (!weightsOrError.isOk) return weightsOrError;

    const rating = Rating.create({
      name,
      description,
      weights: Weights.create(weightsOrError.value),
    });

    await this.ratingRepository.save(rating);

    return ok();
  }
}

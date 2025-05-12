import { Weight } from '@/modules/ratings/domain/Weight';
import { WeightValue } from '@/modules/ratings/domain/WeightValue';
import { ok, Result } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';

import { Rating } from '../domain/Rating';
import { type RatingRepository } from '../repositories/rating/rating.repository';

export type CreateRatingDTO = {
  name: string;
  description?: string;
  weights: {
    name: string;
    value: number;
  }[];
};

type Response = Result<number, Error>;

export class CreateRatingUseCase implements UseCase<CreateRatingDTO, Response> {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async execute(request: CreateRatingDTO): Promise<Response> {
    const weightsOrError = Result.combine(
      request.weights.map((w) => () => {
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
      name: request.name,
      description: request.description,
      weights: weightsOrError.value,
    });

    return ok(await this.ratingRepository.save(rating));
  }
}

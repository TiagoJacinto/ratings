import { type Result, err, ok } from '@/shared/core/Result';
import { type UseCase } from '@/shared/core/UseCase';

import { type Rating } from '../domain/Rating';
import { type RatingRepository } from '../repositories/rating/rating.repository';

export type GetRatingByIdDTO = {
  id: number;
};

export namespace GetRatingByIdErrors {
  export class RatingNotFound {}
}

type Response = Result<Rating, Error>;

export class GetRatingByIdUseCase implements UseCase<GetRatingByIdDTO, Response> {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async execute({ id }: GetRatingByIdDTO): Promise<Response> {
    const rating = await this.ratingRepository.findById(id);

    if (!rating) {
      return err(new Error(`Rating with id: ${id} was not found`));
    }

    return ok(rating);
  }
}

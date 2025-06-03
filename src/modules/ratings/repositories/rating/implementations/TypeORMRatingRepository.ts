import { type DataSource, type Repository } from 'typeorm';
import { type SetNonNullableDeep } from 'type-fest';

import { Rating as RatingModel } from '@/database/entities/Rating';
import { type Rating } from '@/modules/ratings/domain/Rating';
import { TypeORMRatingMapper } from '@/modules/ratings/mappers/TypeORMRatingMapper';

import { type RatingRepository } from '../rating.repository';

export class TypeORMRatingRepository implements RatingRepository {
  private readonly rating: Repository<RatingModel>;
  constructor(orm: DataSource) {
    this.rating = orm.getRepository(RatingModel);
  }

  async findManyByAlternativeCategoryIdForUpdate(id: number) {
    const ratings = await this.rating.find({
      relations: { weights: { criterion: true } },
      where: { alternativeCategory: { id } },
    });

    return ratings.map(TypeORMRatingMapper.toDomain) as SetNonNullableDeep<
      Rating,
      'weights' | `weights.${number}.criterion`
    >[];
  }

  async findById(id: number) {
    const rating = await this.rating.findOneBy({
      id,
    });

    if (!rating) return null;

    return TypeORMRatingMapper.toDomain(rating);
  }

  async findAll() {
    const models = await this.rating.find();
    return models.map(TypeORMRatingMapper.toDomain);
  }

  count() {
    return this.rating.count();
  }

  existsById(id: number) {
    return this.rating.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.rating.delete({ id });
  }

  async save(rating: Rating) {
    const model = TypeORMRatingMapper.toPersistence(rating);

    const createdModel = await this.rating.save(model);
    return createdModel.id;
  }
}

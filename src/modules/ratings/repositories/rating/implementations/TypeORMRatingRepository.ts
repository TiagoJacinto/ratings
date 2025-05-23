import { type DataSource, type Repository } from 'typeorm';

import { Rating as RatingModel } from '@/database/entities/Rating';
import { type Rating } from '@/modules/ratings/domain/Rating';
import { TypeORMRatingMapper } from '@/modules/ratings/mappers/TypeORMRatingMapper';
import { type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type RatingRepository } from '../rating.repository';

export class TypeORMRatingRepository implements RatingRepository {
  private readonly rating: Repository<RatingModel>;
  constructor(orm: DataSource) {
    this.rating = orm.getRepository(RatingModel);
  }

  async findById<TRelations extends Partial<Record<'weights' | 'alternativeCategory', boolean>>>(
    id: number,
    relations?: TRelations,
  ) {
    const rating = await this.rating.findOne({
      relations,
      where: {
        id,
      },
    });

    if (!rating) return null;

    return TypeORMRatingMapper.toDomain(rating) as EntityWithRelations<Rating, TRelations>;
  }

  async findManyByAlternativeCategoryId(id: number) {
    const models = await this.rating.find({
      relations: {
        alternativeCategory: true,
      },
      where: {
        alternativeCategory: {
          id,
        },
      },
    });
    return models.map(TypeORMRatingMapper.toDomain);
  }

  async findAll() {
    const models = await this.rating.find();
    return models.map(TypeORMRatingMapper.toDomain);
  }

  count() {
    return this.rating.count();
  }

  // async findById(id: number) {
  // }
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

import { Rating as RatingModel } from '@/database/entities/Rating';
import { type Rating } from '@/modules/ratings/domain/Rating';
import { TypeORMRatingMapper } from '@/modules/ratings/mappers/TypeORMRatingMapper';
import { type WeightRepository } from '@/modules/weights/repositories/weight/weight.repository';
import { type DataSource, type Repository } from 'typeorm';

import { type RatingRepository } from '../rating.repository';

export class TypeORMRatingRepository implements RatingRepository {
  private readonly rating: Repository<RatingModel>;
  constructor(
    orm: DataSource,
    private readonly weightRepository: WeightRepository,
  ) {
    this.rating = orm.getRepository(RatingModel);
  }

  count() {
    return this.rating.count();
  }

  async findById(id: number) {
    const rating = await this.rating.findOneBy({ id });

    if (!rating) return null;

    return TypeORMRatingMapper.toDomain(rating);
  }

  existsById(id: number) {
    return this.rating.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.rating.delete({ id });
  }

  async save(rating: Rating) {
    const model = TypeORMRatingMapper.toPersistence(rating);

    await this.weightRepository.saveMany(rating.weights);

    const createdModel = await this.rating.save(model);
    return createdModel.id;
  }
}

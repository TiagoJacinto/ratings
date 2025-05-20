import { type DataSource, type Repository } from 'typeorm';

import { RatedCriterion as RatedCriterionModel } from '@/database/entities/RatedCriterion';
import { type RatedCriterion } from '@/modules/alternatives/domain/RatedCriterion';
import { TypeORMRatedCriterionMapper } from '@/modules/alternatives/mappers/TypeORMRatedCriterionMapper';

import { type RatedCriterionRepository } from '../rated-criterion.repository';

export class TypeORMRatedCriterionRepository implements RatedCriterionRepository {
  private readonly ratedCriterion: Repository<RatedCriterionModel>;
  constructor(orm: DataSource) {
    this.ratedCriterion = orm.getRepository(RatedCriterionModel);
  }

  async findManyByAlternativeId(id: number) {
    const models = await this.ratedCriterion.find({
      relations: {
        criterion: true,
      },
      where: {
        alternative: {
          id,
        },
      },
    });

    return models.map(TypeORMRatedCriterionMapper.toDomain);
  }

  async findAll() {
    const models = await this.ratedCriterion.find({
      relations: {
        criterion: true,
      },
    });
    return models.map(TypeORMRatedCriterionMapper.toDomain);
  }

  count() {
    return this.ratedCriterion.count();
  }

  async findById(id: number) {
    const ratedCriterion = await this.ratedCriterion.findOne({
      relations: {
        criterion: true,
      },
      where: {
        id,
      },
    });

    if (!ratedCriterion) return null;

    return TypeORMRatedCriterionMapper.toDomain(ratedCriterion);
  }

  existsById(id: number) {
    return this.ratedCriterion.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.ratedCriterion.delete({ id });
  }

  async save(ratedCriterion: RatedCriterion) {
    const model = TypeORMRatedCriterionMapper.toPersistence(ratedCriterion);

    const createdModel = await this.ratedCriterion.save(model);
    return createdModel.id;
  }
}

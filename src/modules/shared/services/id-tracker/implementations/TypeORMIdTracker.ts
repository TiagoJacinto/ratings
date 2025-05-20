import { type DataSource, type Repository } from 'typeorm';

import { IdSequence } from '@/database/entities/IdSequence';

import { type IdTracker } from '../id-tracker';

export class TypeORMIdTracker implements IdTracker {
  private readonly idSequence: Repository<IdSequence>;
  constructor(orm: DataSource) {
    this.idSequence = orm.getRepository(IdSequence);
  }

  async moveToNextId(name: string) {
    const model = await this.idSequence.findOneByOrFail({ name });

    model.id++;
    await this.idSequence.save(model);

    return model.id;
  }
}

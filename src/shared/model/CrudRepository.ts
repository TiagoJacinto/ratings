import { type AsyncMaybe } from '../core/Maybe';

export interface CrudRepository<TEntity, TID> {
  count(): Promise<number>;
  findAll(): Promise<TEntity[]>;
  findById(id: TID): AsyncMaybe<TEntity>;
  existsById(id: TID): Promise<boolean>;
  deleteById(id: TID): Promise<void>;
  save(entity: TEntity): Promise<TID>;
}

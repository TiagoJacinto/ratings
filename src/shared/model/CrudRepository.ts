import { type AsyncMaybe } from '../core/Maybe';

export type EntityWithRelations<TEntity, TRelations> = TEntity & {
  [i in Extract<keyof TRelations, keyof TEntity>]: TRelations[i] extends true
    ? NonNullable<TEntity[i]>
    : undefined;
};

export type EntityRelations<TRelationName extends PropertyKey> = Partial<
  Record<TRelationName, boolean>
>;

export interface CrudRepository<TEntity, TID, TRelationName extends keyof TEntity> {
  count(): Promise<number>;
  findAll(): Promise<TEntity[]>;
  findById<TRelations extends EntityRelations<TRelationName>>(
    id: TID,
    relations?: TRelations,
  ): AsyncMaybe<EntityWithRelations<TEntity, TRelations>>;
  existsById(id: TID): Promise<boolean>;
  deleteById(id: TID): Promise<void>;
  save(entity: TEntity): Promise<TID>;
}

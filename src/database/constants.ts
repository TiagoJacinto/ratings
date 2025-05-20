import { type RelationOptions } from 'typeorm';

export const manyToOneOptions: RelationOptions = {
  cascade: ['insert', 'recover', 'soft-remove', 'update'],
  orphanedRowAction: 'delete',
};

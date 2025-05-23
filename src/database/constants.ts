import { type RelationOptions } from 'typeorm';

export const oneToManyOptions: RelationOptions = {
  cascade: true,
};

export const manyToOneOptions: RelationOptions = {
  cascade: ['insert', 'recover', 'soft-remove', 'update'],
  orphanedRowAction: 'delete',
};

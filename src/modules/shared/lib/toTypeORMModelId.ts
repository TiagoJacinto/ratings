import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { isTemporaryId } from './isTemporaryId';

export const toTypeORMModelId = (entityId: UniqueEntityID) => {
  const id = entityId.toValue();

  if (typeof id === 'string' || isTemporaryId(id)) return undefined;
  return id;
};

import { randomUUID } from 'crypto';

import { Identifier } from './Identifier';
import { type RawId } from './RawId';

export class UniqueEntityID extends Identifier<RawId> {
  constructor(id?: RawId) {
    super(id ?? randomUUID?.() ?? crypto.randomUUID());
  }
}

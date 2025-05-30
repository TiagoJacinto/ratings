import { randomUUID } from 'crypto';

import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ?? randomUUID?.() ?? crypto.randomUUID());
  }
}

import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { type WeightValue } from './WeightValue';

type WeightProps = {
  name: string;
  value: WeightValue;
};

export class Weight extends Entity<WeightProps> {
  get name() {
    return this.props.name;
  }

  get value() {
    return this.props.value;
  }

  static create(props: WeightProps, id?: UniqueEntityID) {
    return new this(props, id);
  }
}

import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { type Criterion } from '@/modules/alternatives/domain/Criterion';

import { type WeightValue } from './WeightValue';

type WeightProps = {
  criterion?: Criterion;
  value: WeightValue;
};

export class Weight extends Entity<WeightProps> {
  static create(props: WeightProps, id?: UniqueEntityID) {
    return new this(props, id);
  }

  get id() {
    return this._id;
  }

  get criterion() {
    return this.props.criterion;
  }

  get value() {
    return this.props.value;
  }
}

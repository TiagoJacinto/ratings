import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { type RatedCriterionValue } from './RatedCriterionValue';
import { type Criterion } from './Criterion';

type RatedCriterionProps = {
  criterion?: Criterion;
  value: RatedCriterionValue;
};

export class RatedCriterion extends Entity<RatedCriterionProps> {
  static create(props: RatedCriterionProps, id?: UniqueEntityID) {
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

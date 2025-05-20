import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { type AlternativeCategory } from './AlternativeCategory';

type CriterionProps = {
  name: string;
  alternativeCategory?: AlternativeCategory;
  description?: string;
};

export class Criterion extends Entity<CriterionProps> {
  static create(props: CriterionProps, id?: UniqueEntityID) {
    return new this(props, id);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get alternativeCategory() {
    return this.props.alternativeCategory;
  }

  get description() {
    return this.props.description;
  }
}

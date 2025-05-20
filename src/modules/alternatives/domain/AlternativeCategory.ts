import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { Entity } from '@/shared/domain/Entity';
import { type Rating } from '@/modules/ratings/domain/Rating';

import { type Alternative } from './Alternative';
import { type Criterion } from './Criterion';

type AlternativeCategoryProps = {
  name: string;
  alternatives?: Alternative[];
  criteria?: Criterion[];
  description?: string;
  ratings?: Rating[];
};

export class AlternativeCategory extends Entity<AlternativeCategoryProps> {
  static create(props: AlternativeCategoryProps, id?: UniqueEntityID) {
    return new this(props, id);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get alternatives() {
    return this.props.alternatives;
  }

  get criteria() {
    return this.props.criteria;
  }

  get ratings() {
    return this.props.ratings;
  }

  get description() {
    return this.props.description;
  }
}

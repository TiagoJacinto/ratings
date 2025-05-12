import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { type SetOptional } from 'type-fest';

import { type Weight } from './Weight';

type RatingProps = {
  name: string;
  description?: string;
  weights: Weight[];
};

export class Rating extends Entity<RatingProps> {
  static create(props: SetOptional<RatingProps, 'weights'>, id?: UniqueEntityID) {
    return new this({ ...props, weights: props.weights ?? [] }, id);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get weights() {
    return this.props.weights;
  }
}

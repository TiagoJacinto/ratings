import { Weights } from '@/modules/ratings/domain/Weights';
import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { type SetOptional } from 'type-fest';

type RatingProps = {
  name: string;
  description?: string;
  weights: Weights;
};

export class Rating extends Entity<RatingProps> {
  static create(props: SetOptional<RatingProps, 'weights'>, id?: UniqueEntityID) {
    return new this({ ...props, weights: props.weights ?? Weights.create() }, id);
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

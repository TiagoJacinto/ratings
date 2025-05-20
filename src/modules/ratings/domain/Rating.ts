import { type SetOptional } from 'type-fest';

import { Entity } from '@/shared/domain/Entity';
import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { type AlternativeCategory } from '@/modules/alternatives/domain/AlternativeCategory';

import { type Weight } from './Weight';

type RatingProps = {
  name: string;
  alternativeCategory?: AlternativeCategory;
  description?: string;
  weights?: Weight[];
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

  get alternativeCategory() {
    return this.props.alternativeCategory;
  }

  get weights() {
    return this.props.weights;
  }
}

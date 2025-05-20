import { type SetOptional } from 'type-fest';

import { type UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { Entity } from '@/shared/domain/Entity';

import { type RatedCriterion } from './RatedCriterion';
import { type AlternativeCategory } from './AlternativeCategory';

type AlternativeProps = {
  name: string;
  alternativeCategory: AlternativeCategory;
  description?: string;
  ratedCriteria: RatedCriterion[];
};

export class Alternative extends Entity<AlternativeProps> {
  static create(props: SetOptional<AlternativeProps, 'ratedCriteria'>, id?: UniqueEntityID) {
    return new this({ ...props, ratedCriteria: props.ratedCriteria ?? [] }, id);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get ratedCriteria() {
    return this.props.ratedCriteria;
  }

  get alternativeCategory() {
    return this.props.alternativeCategory;
  }

  get description() {
    return this.props.description;
  }
}

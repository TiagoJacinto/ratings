/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import type { Maybe } from '@/shared/core/Maybe';

import { RatedCriterion } from './RatedCriterion';
import { AlternativeCategory } from './AlternativeCategory';
import { manyToOneOptions } from '../constants';
import { Weight } from './Weight';

type Props = {
  id?: number;
  name: string;
  alternativeCategory?: AlternativeCategory;
  description?: string;
  ratedCriteria?: RatedCriterion[];
  weights?: Weight[];
};

@Unique(['alternativeCategory', 'name'])
@Entity({ name: 'criteria' })
export class Criterion {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => RatedCriterion, (ratedCriterion) => ratedCriterion.criterion, {
    cascade: true,
  })
  ratedCriteria?: RatedCriterion[];

  @OneToMany(() => Weight, (weight) => weight.criterion, {
    cascade: true,
  })
  weights?: Weight[];

  @ManyToOne(
    () => AlternativeCategory,
    (alternativeCategory) => alternativeCategory.criteria,
    manyToOneOptions,
  )
  alternativeCategory?: AlternativeCategory;

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.name = props?.name!;
    this.description = props?.description;
    this.ratedCriteria = props?.ratedCriteria;
    this.weights = props?.weights;
    this.alternativeCategory = props?.alternativeCategory;
  }
}

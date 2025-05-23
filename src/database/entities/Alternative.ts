/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import type { Maybe } from '@/shared/core/Maybe';

import { AlternativeCategory } from './AlternativeCategory';
import { RatedCriterion } from './RatedCriterion';
import { manyToOneOptions, oneToManyOptions } from '../constants';

type Props = {
  id?: number;
  name: string;
  description?: string;
  ratedCriteria?: RatedCriterion[];
};

@Unique(['alternativeCategory', 'name'])
@Entity({ name: 'alternatives' })
export class Alternative {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => RatedCriterion, (ratedCriterion) => ratedCriterion.alternative, oneToManyOptions)
  ratedCriteria?: RatedCriterion[];

  @ManyToOne(
    () => AlternativeCategory,
    (alternativeCategory) => alternativeCategory.alternatives,
    manyToOneOptions,
  )
  alternativeCategory?: AlternativeCategory;

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.name = props?.name!;
    this.ratedCriteria = props?.ratedCriteria;
    this.description = props?.description;
  }
}

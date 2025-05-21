/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import type { Maybe } from '@/shared/core/Maybe';

import { AlternativeCategory } from './AlternativeCategory';
import { RatedCriterion } from './RatedCriterion';
import { manyToOneOptions } from '../constants';

type Props = {
  id?: number;
  name: string;
  description?: string;
  ratedCriteria?: RatedCriterion[];
};

@Entity({ name: 'alternatives' })
export class Alternative {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => RatedCriterion, (ratedCriterion) => ratedCriterion.alternative, {
    cascade: true,
  })
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

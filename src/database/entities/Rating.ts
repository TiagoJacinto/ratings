/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import type { Maybe } from '@/shared/core/Maybe';

import { Weight } from './Weight';
import { AlternativeCategory } from './AlternativeCategory';
import { manyToOneOptions, oneToManyOptions } from '../constants';

type Props = {
  id?: number;
  name: string;
  alternativeCategory?: AlternativeCategory;
  description?: string;
  weights?: Weight[];
};

@Unique(['alternativeCategory', 'name'])
@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => Weight, (weight) => weight.rating, oneToManyOptions)
  weights?: Weight[];

  @ManyToOne(
    () => AlternativeCategory,
    (alternativeCategory) => alternativeCategory.ratings,
    manyToOneOptions,
  )
  alternativeCategory?: AlternativeCategory;

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.name = props?.name!;
    this.description = props?.description;
    this.weights = props?.weights;
    this.alternativeCategory = props?.alternativeCategory;
  }
}

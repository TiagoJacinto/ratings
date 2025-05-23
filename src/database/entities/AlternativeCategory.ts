/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import type { Maybe } from '@/shared/core/Maybe';

import { Alternative } from './Alternative';
import { Criterion } from './Criterion';
import { Rating } from './Rating';
import { oneToManyOptions } from '../constants';

type Props = {
  id?: number;
  name: string;
  alternatives?: Alternative[];
  criteria?: Criterion[];
  description?: string;
  ratings?: Rating[];
};

@Entity({ name: 'alternative_categories' })
export class AlternativeCategory {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => Criterion, (criterion) => criterion.alternativeCategory, oneToManyOptions)
  criteria?: Criterion[];

  @OneToMany(() => Alternative, (alternative) => alternative.alternativeCategory, oneToManyOptions)
  alternatives?: Alternative[];

  @OneToMany(() => Rating, (rating) => rating.alternativeCategory, oneToManyOptions)
  ratings?: Rating[];

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.name = props?.name!;
    this.description = props?.description;
    this.alternatives = props?.alternatives;
    this.criteria = props?.criteria;
    this.ratings = props?.ratings;
  }
}

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Rating } from './Rating';
import { Criterion } from './Criterion';
import { manyToOneOptions } from '../constants';

type Props = {
  id?: number;
  criterion?: Criterion;
  value: number;
};

@Entity({ name: 'weights' })
export class Weight {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'real' })
  value: number;

  @ManyToOne(() => Criterion, (criterion) => criterion.weights, manyToOneOptions)
  criterion?: Criterion;

  @ManyToOne(() => Rating, (rating) => rating.weights, manyToOneOptions)
  rating?: Rating;

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.criterion = props?.criterion;
    this.value = props?.value!;
  }
}

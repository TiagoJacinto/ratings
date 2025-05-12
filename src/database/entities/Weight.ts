/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Rating } from './Rating';
// import { Criterion } from './Criterion';

type Props = {
  id?:number
  value: number;
};

@Entity({ name: 'weights' })
export class Weight {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'real' })
  value: number;

  // @ManyToOne(() => Criterion, (criterion) => criterion.weights, {
  //   cascade: true,
  // })
  // criterion!: Criterion;

  @ManyToOne(() => Rating, (rating) => rating.weights, {
    cascade: true,
  })
  rating!: Rating;

  constructor(props: Props | undefined) {
    this.id= props?.id!;
    this.value = props?.value!;
  }
}

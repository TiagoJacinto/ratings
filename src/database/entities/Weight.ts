/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Rating } from './Rating';

type Props = {
  name: string;
  value: number;
};

@Entity({ name: 'weights' })
export class Weight {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: false, type: 'real' })
  value: number;

  @ManyToOne(() => Rating, (rating) => rating.weights, {
    cascade: true,
  })
  rating!: Rating;

  constructor(props: Props | undefined) {
    this.name = props?.name!;
    this.value = props?.value!;
  }
}

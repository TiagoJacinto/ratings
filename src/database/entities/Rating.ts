/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { Maybe } from '@/shared/core/Maybe';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Weight } from './Weight';

type Props = {
  id?: number;
  name: string;
  description?: string;
  weights: Weight[];
};

@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Maybe<string>;

  @OneToMany(() => Weight, (weight) => weight.rating, {
    cascade: ['insert', 'recover', 'soft-remove', 'update'],
  })
  weights: Weight[];

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.name = props?.name!;
    this.description = props?.description;
    this.weights = props?.weights!;
  }
}

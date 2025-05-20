/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Criterion } from './Criterion';
import { Alternative } from './Alternative';
import { manyToOneOptions } from '../constants';

type Props = {
  id?: number;
  criterion?: Criterion;
  value: number;
};

@Entity({ name: 'rated_criteria' })
export class RatedCriterion {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ nullable: false, type: 'int' })
  value: number;

  @ManyToOne(() => Criterion, (criterion) => criterion.ratedCriteria, manyToOneOptions)
  criterion?: Criterion;

  @ManyToOne(() => Alternative, (alternative) => alternative.ratedCriteria, manyToOneOptions)
  alternative?: Alternative;

  constructor(props: Props | undefined) {
    this.id = props?.id!;
    this.criterion = props?.criterion;
    this.value = props?.value!;
  }
}

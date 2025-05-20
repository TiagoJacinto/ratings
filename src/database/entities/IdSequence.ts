/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Column, Entity, PrimaryColumn } from 'typeorm';

type Props = {
  name: string;
  id: number;
};

@Entity({ name: 'id_sequence' })
export class IdSequence {
  @PrimaryColumn({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: false, type: 'integer' })
  id: number;

  constructor(props: Props | undefined) {
    this.name = props?.name!;
    this.id = props?.id!;
  }
}

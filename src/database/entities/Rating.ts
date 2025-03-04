import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Weight } from './Weight';

@Entity({ name: 'ratings' })
export class Rating {
	@PrimaryGeneratedColumn({ type: 'integer' })
	id!: number;

	@Column({ type: 'text', nullable: false })
	name!: string;

	@Column({ type: 'text' })
	description!: string;

	@OneToMany(() => Weight, (weight) => weight.rating, {
		cascade: ['insert', 'recover', 'soft-remove', 'update']
	})
	weights!: Weight[];
}

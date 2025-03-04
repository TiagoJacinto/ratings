import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Rating } from './Rating';

@Entity({ name: 'weights' })
export class Weight {
	@PrimaryGeneratedColumn({ type: 'integer' })
	id!: number;

	@Column({ type: 'text', nullable: false })
	name!: string;

	@Column({ type: 'real', nullable: false })
	value!: number;

	@ManyToOne(() => Rating, (rating) => rating.weights, {
		nullable: false,
		cascade: true
	})
	rating!: Rating;
}

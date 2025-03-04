import { Table, TableForeignKey, type MigrationInterface, type QueryRunner } from 'typeorm';

export class Initial1740488453551 implements MigrationInterface {
	async up(queryRunner: QueryRunner) {
		await queryRunner.createTable(
			new Table({
				name: 'ratings',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'name',
						type: 'text',
						isNullable: false
					},
					{
						name: 'description',
						type: 'text'
					}
				]
			})
		);

		await queryRunner.createTable(
			new Table({
				name: 'weights',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'name',
						type: 'text',
						isNullable: false
					},
					{
						name: 'value',
						type: 'real',
						isNullable: false
					},
					{
						name: 'rating_id',
						type: 'integer',
						isNullable: false
					}
				]
			})
		);

		await queryRunner.createForeignKey(
			'weights',
			new TableForeignKey({
				name: 'rating',
				columnNames: ['rating_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'ratings',
				onDelete: 'CASCADE'
			})
		);
	}
	async down(queryRunner: QueryRunner) {
		await queryRunner.dropForeignKey('weights', 'rating');
		await queryRunner.dropTable('ratings');
		await queryRunner.dropTable('weights');
	}
}

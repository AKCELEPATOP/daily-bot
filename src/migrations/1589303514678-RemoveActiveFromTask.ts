import {MigrationInterface, QueryRunner} from 'typeorm';

export class RemoveActiveFromTask1589303514678 implements MigrationInterface {
    name = 'RemoveActiveFromTask1589303514678';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "active"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" ADD "active" boolean NOT NULL DEFAULT true`, undefined);
    }

}

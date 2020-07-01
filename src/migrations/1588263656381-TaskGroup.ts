import {MigrationInterface, QueryRunner} from 'typeorm';

export class TaskGroup1588263656381 implements MigrationInterface {
    name = 'TaskGroup1588263656381';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "task_group" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_465a127df1ace09f377dd2eef6f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f5008033471d16887bb2ea4e5" ON "task_group" ("code") `, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD "group_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_465a127df1ace09f377dd2eef6f" FOREIGN KEY ("group_id") REFERENCES "task_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_465a127df1ace09f377dd2eef6f"`, undefined);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "group_id"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2f5008033471d16887bb2ea4e5"`, undefined);
        await queryRunner.query(`DROP TABLE "task_group"`, undefined);
    }

}

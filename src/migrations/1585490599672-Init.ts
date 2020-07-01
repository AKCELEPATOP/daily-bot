import {MigrationInterface, QueryRunner} from 'typeorm';

export class Init1585490599672 implements MigrationInterface {
    name = 'Init1585490599672';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "slack_id" character varying NOT NULL, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_792aeb76cb66f5ce066d47cbd4" ON "team" ("slack_id") `, undefined);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "last_invoiced" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "slack_id" character varying NOT NULL, "im_id" character varying NOT NULL, "name" character varying NOT NULL, "real_name" character varying NOT NULL, "tz" character varying NOT NULL, "tz_offset" integer NOT NULL, "team_id" integer NOT NULL, "next_daily" TIMESTAMP NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "daily" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "handle_new_task_to" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_2f5e6c9d57ae96fad69b6f97bd5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "daily_to_task" ("handled" boolean NOT NULL DEFAULT false, "dailyId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_12987e345ab0aa9ff0ed1f988db" PRIMARY KEY ("dailyId", "taskId"))`, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_155dbc144ff2bd4713fdf1f6c77" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "daily" ADD CONSTRAINT "FK_374f75e6b7fddf09a1908068536" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_to_task" ADD CONSTRAINT "FK_a98c5fcbb62da759cc1a44e133b" FOREIGN KEY ("dailyId") REFERENCES "daily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_to_task" ADD CONSTRAINT "FK_da36b0e3dd5def44ea65eab3d51" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "daily_to_task" DROP CONSTRAINT "FK_da36b0e3dd5def44ea65eab3d51"`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_to_task" DROP CONSTRAINT "FK_a98c5fcbb62da759cc1a44e133b"`, undefined);
        await queryRunner.query(`ALTER TABLE "daily" DROP CONSTRAINT "FK_374f75e6b7fddf09a1908068536"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_155dbc144ff2bd4713fdf1f6c77"`, undefined);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`, undefined);
        await queryRunner.query(`DROP TABLE "daily_to_task"`, undefined);
        await queryRunner.query(`DROP TABLE "daily"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "task"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_792aeb76cb66f5ce066d47cbd4"`, undefined);
        await queryRunner.query(`DROP TABLE "team"`, undefined);
    }

}

import {MigrationInterface, QueryRunner} from 'typeorm';
import {TaskGroupCode} from '../task-group/task-group.enum';

export class MigrateToGroups1588264270862 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        WITH task_for_group AS (
            SELECT t.id AS task_id,
                   tg.id as group_id
            FROM (SELECT t.id,
                         CASE
                             WHEN t.active THEN '${TaskGroupCode.ACTIVE}'
                             ELSE '${TaskGroupCode.COMPLETED}'
                             END AS code
                  FROM task t
                  WHERE t.active IS NOT NULL) t
                     JOIN task_group tg ON t.code = tg.code
        )
        UPDATE task t
        SET group_id = tfg.group_id
        FROM task_for_group AS tfg
        WHERE t.id = tfg.task_id`);
    }

    // tslint:disable-next-line:no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {}

}

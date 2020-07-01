import {MigrationInterface, QueryRunner} from 'typeorm';
import {TaskGroupCode} from '../task-group/task-group.enum';

export class AddTaskGroups1588263812938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "task_group"
                (code, name, "order") VALUES
                           ('${TaskGroupCode.ACTIVE}', 'Активные', 50),
                           ('${TaskGroupCode.COMPLETED}', 'Завершенные', 100),
                           ('${TaskGroupCode.CANCELED}', 'Отмененные', 150)
       `);
    }

    // tslint:disable-next-line:no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {}
}

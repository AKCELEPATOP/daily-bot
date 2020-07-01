import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddTags1585584188947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "tag" (code) VALUES ('smart'), ('clumsy')`);
    }

    // tslint:disable-next-line:no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {}

}

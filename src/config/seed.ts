import * as main from './database';
import {ConnectionOptions} from 'typeorm';
import {normalize} from 'path';

const appDir = normalize(__dirname + '/..');

const dbConfig: ConnectionOptions = {
    ...main,
    migrationsTableName: 'seeds',
    migrations: [appDir + '/seeds/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/seeds',
    },
};

export = dbConfig;

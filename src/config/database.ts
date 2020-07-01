import {ConnectionOptions} from 'typeorm';
import {config} from 'dotenv';
import {normalize, resolve} from 'path';

const appDir = normalize(__dirname + '/..');

// Для работы typeorm cli
if (!process.env.TYPEORM_HOST) {
    const ENV = process.env.NODE_ENV || 'local';
    config({path: resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`)});
}

const dbConfig: ConnectionOptions = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [appDir + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    // migrationsRun: true,
    migrations: [appDir + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
export = dbConfig;

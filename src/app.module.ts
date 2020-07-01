import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from 'nestjs-config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DailyModule} from './daily/daily.module';
import {TaskModule} from './task/task.module';
import {TeamModule} from './team/team.module';
import {UserModule} from './user/user.module';
import {SlackModule} from './slack/slack.module';
import {AuthModule} from './auth/auth.module';
import {PaginateModule} from './paginate/paginate.module';
import * as path from 'path';
import {MyStemModule} from './mystem/my-stem.module';
import {TagModule} from './tag/tag.module';
import {TaskGroupModule} from './task-group/task-group.module';
import {I18nJsonParser, I18nModule} from 'nestjs-i18n';
import {ScheduleModule} from '@nestjs/schedule';

const ENV = process.env.NODE_ENV;

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}'), {
            path: path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`),
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => config.get('database'),
            inject: [ConfigService],
        }),
        PaginateModule.forRootAsync({
            useFactory: (config: ConfigService) => config.get('paginate'),
            inject: [ConfigService],
        }),
        MyStemModule.forRootAsync({
            useFactory: (config: ConfigService) => config.get('my-stem'),
            inject: [ConfigService],
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            parser: I18nJsonParser,
            parserOptions: {
                path: path.join(__dirname, '/i18n/'),
            },
        }),
        ScheduleModule.forRoot(),
        DailyModule,
        TaskGroupModule,
        TaskModule,
        TeamModule,
        UserModule,
        SlackModule,
        AuthModule,
        TagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}

import {MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, RequestMethod} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {DailyModule} from '../daily/daily.module';
import {ActionHandlerService} from './services/action-handler.service';
import {EventHandlerService} from './services/event-handler.service';
import {CommandHandlerService} from './services/command-handler.service';
import {MessageHandlerService} from './services/message-handler.service';
import {SlackService} from './services/slack.service';
import {TaskModule} from '../task/task.module';
import {SlackSignatureMiddleware} from './middleware/slack-signature.middleware';
import {SlackController} from './slack.controller';
import {TeamModule} from '../team/team.module';
import {DailyHoldingService} from './services/daily-holding.service';
import {MessageRenderService} from './services/message-render.service';
import {TeamManageService} from './services/team-manage.service';
import {TaskManageService} from './services/task-manage.service';
import {ConfigModule, ConfigService} from 'nestjs-config';
import {SLACK_MODULE_OPTIONS} from './constants';
import {JsonParserMiddleware} from './middleware/parser/json-parser.middleware';
import {UrlencodedParserMiddleware} from './middleware/parser/urlencoded-parser.middleware';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        TeamModule,
        DailyModule,
        TaskModule,
    ],
    controllers: [SlackController],
    providers: [
        TeamManageService,
        TaskManageService,
        ActionHandlerService,
        EventHandlerService,
        CommandHandlerService,
        MessageHandlerService,
        DailyHoldingService,
        SlackService,
        MessageRenderService,
        {
            provide: SLACK_MODULE_OPTIONS,
            useFactory: (config) => config.get('slack'),
            inject: [ConfigService],
        },
    ],
    exports: [SlackService],
})
export class SlackModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(SlackSignatureMiddleware, JsonParserMiddleware, UrlencodedParserMiddleware)
            .forRoutes(SlackController);
    }
}

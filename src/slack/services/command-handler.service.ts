import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from 'nestjs-config';
import {SlackCommandInterface} from '../types/slack-command.interface';
import {User} from '../../user/user.entity';
import {CreateViewMessage} from '../messages/create-view.message';
import {SlackService} from './slack.service';
import {UserService} from '../../user/user.service';
import {HelpMessage} from '../messages/help.message';
import {MessageRenderService} from './message-render.service';
import {TaskService} from '../../task/task.service';
import {parse, format} from 'url';
import {LastActiveTasksMessage} from '../messages/last-active-tasks.message';
import {DailyHoldingService} from './daily-holding.service';
import {TeamManageService} from './team-manage.service';
import {NoActiveTasksMessage} from '../messages/no-active-tasks.message';

@Injectable()
export class CommandHandlerService {

    constructor(
        protected readonly slackService: SlackService,
        protected readonly userService: UserService,
        protected readonly configService: ConfigService,
        protected readonly messageRenderService: MessageRenderService,
        protected readonly taskService: TaskService,
        protected readonly dailyHoldingService: DailyHoldingService,
        protected readonly teamManageService: TeamManageService,
    ) {
    }

    public async handle(command: SlackCommandInterface): Promise<string | undefined> {
        if (!this.isAvailable(command.text)) {
            return;
        }
        return this[command.text](command);
    }

    /**
     * User registration
     *
     * @param command
     */
    protected async start(command: SlackCommandInterface): Promise<string> {
        const existingUser = await this.getUser(command.user_id);
        if (existingUser) {
            return this.configService.get('responses.user_already_registered');
        }

        const user = await this.teamManageService.createUser(command.user_id);
        await this.slackService.postRawMessageToChat(user.imId, this.configService.get('responses.greeting'));
        await this.dailyHoldingService.sendDailyReminder(user.imId);
        return this.configService.get('responses.user_registered_message');
    }

    protected async create(command: SlackCommandInterface) {
        const user = await this.userService.findBySlackId(command.user_id);
        if (user) {
            const view = new CreateViewMessage();
            try {
                await this.slackService.openView(command.trigger_id, view.render());
            } catch (e) {
                Logger.error(e);
            }
        }
    }

    protected async help(command: SlackCommandInterface) {
        await this.slackService.postEphemeralMessage(
            command.channel_id,
            command.user_id,
            await this.messageRenderService.getMessage(HelpMessage),
        );
    }

    protected async list(command: SlackCommandInterface) {
        const user = await this.userService.findBySlackId(command.user_id);
        if (user) {
            const tasks = await this.taskService.findLastActiveForUser(user);
            const otherLink = parse(process.env.APP_FRONTEND_DOMAIN, true);
            otherLink.query = {
                self: 'true',
            };
            const message = (tasks && tasks.length) ?
                await this.messageRenderService.getMessage(
                    LastActiveTasksMessage,
                    null,
                    tasks,
                    format(otherLink),
                ) :
                await this.messageRenderService.getMessage(NoActiveTasksMessage);
            await this.slackService.postEphemeralMessage(command.channel_id, command.user_id, message);
        }
    }

    private isAvailable(command: string) {
        return Object.keys(this.configService.get('commands')).includes(command);
    }

    protected getUser(userId: string): Promise<User | undefined> {
        return this.userService.findBySlackId(userId);
    }
}

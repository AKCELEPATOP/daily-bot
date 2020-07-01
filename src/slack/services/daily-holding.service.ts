import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from 'nestjs-config';
import {User} from '../../user/user.entity';
import {SlackEventInterface} from '../types/slack-event.interface';
import {Task} from '../../task/task.entity';
import {DailyService} from '../../daily/daily.service';
import {SlackService} from './slack.service';
import {WebAPICallResult} from '@slack/client';
import {RequestDailyMessage} from '../messages/request-daily.message';
import {MessageRenderService} from './message-render.service';
import {Cron} from '@nestjs/schedule';
import {TaskManageService} from './task-manage.service';

@Injectable()
export class DailyHoldingService {
    private readonly logger = new Logger(DailyHoldingService.name);

    constructor(
        protected readonly configService: ConfigService,
        protected readonly dailyService: DailyService,
        @Inject(forwardRef(() => SlackService))
        protected readonly slackService: SlackService,
        protected readonly messageRenderService: MessageRenderService,
        @Inject(forwardRef(() => TaskManageService))
        protected readonly taskManageService: TaskManageService,
    ) {}

    @Cron('0 * * * *') // 0 * * * *
    public async startDaily() {
        try {
            const users = await this.dailyService.getUsersForDaily();
            const promises = users.map(user => this.sendDailyReminder(user));
            await Promise.all(promises);
        } catch (e) {
            this.logger.error(e);
        }
    }

    public async sendDailyReminder(imId: string): Promise<WebAPICallResult | undefined> {
        try {
            return await this.slackService.postReachMessageToChat(
                imId,
                await this.messageRenderService.getMessage(
                    RequestDailyMessage,
                ),
            );
        } catch (e) {
            Logger.error('An error occurred while trying to send daily reminder :: ' + e.message);
        }
    }

    public async handleDailyInput(user: User, event: SlackEventInterface): Promise<Task[] | void> {
        if (this.isExitCommand(event.text)) {
            await this.dailyService.lockCreateNewTasks(user);
            await this.slackService.postRawMessageToChat(
                user.imId,
                this.configService.get('responses.daily_finished'),
            );
            return;
        }
        const taskTexts = event.text
            .split(/\r\n|\n|\r/)
            .filter((task) => task);
        return Promise.all(taskTexts.map((task) => this.taskManageService.createForUser(user, task)));
    }

    public getListenTasksMessage(): string {
        return this.configService.get('responses.listen_new_tasks') +
            this.getFormatExitCommand();
    }

    public isExitCommand(input: string): boolean {
        return input === this.getExitCommand() ||
            input === this.getFormatExitCommand();
    }

    protected getFormatExitCommand(): string {
        return `*${this.getExitCommand()}*`;
    }

    protected getExitCommand(): string {
        return this.configService.get('messages.exit');
    }
}

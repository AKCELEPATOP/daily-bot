import {Injectable, Logger} from '@nestjs/common';
import {DateTime} from 'luxon';
import {BaseSlackActionInterface} from '../types/action/base/base-slack-action.interface';
import {BaseViewActionInterface} from '../types/action/base/base-view-action.interface';
import {CreateTaskActionInterface} from '../types/action/create-task-action.interface';
import {Task} from '../../task/task.entity';
import {TaskService} from '../../task/task.service';
import {UserService} from '../../user/user.service';
import {SlackService} from './slack.service';
import {BlockActionInterface} from '../types/action/block-action.interface';
import {BaseBlockActionInterface} from '../types/action/base/base-block-action.interface';
import {DailyService} from '../../daily/daily.service';
import {HandleTaskMessage} from '../messages/handle-task.message';
import {DailyStartedMessage} from '../messages/daily-started.message';
import {HandledTaskMessage} from '../messages/handled-task.message';
import {DailyAlreadyStartedMessage} from '../messages/daily-already-started.message';
import {DailyPostponedMessage} from '../messages/daily-postponed.message';
import {Daily} from '../../daily/daily.entity';
import {User} from '../../user/user.entity';
import {DailyHoldingService} from './daily-holding.service';
import {TaskGroupCode} from '../../task-group/task-group.enum';
import {MessageRenderService} from './message-render.service';
import {TaskStatus, TaskStatusEnum} from '../types/message/task-status.enum';
import {TaskManageService} from './task-manage.service';

@Injectable()
export class ActionHandlerService {

    constructor(
        protected readonly taskService: TaskService,
        protected readonly userService: UserService,
        protected readonly slackService: SlackService,
        protected readonly dailyService: DailyService,
        protected readonly dailyHoldingService: DailyHoldingService,
        protected readonly messageRenderService: MessageRenderService,
        protected readonly taskManageService: TaskManageService,
    ) {
    }

    public async handle(action: BaseSlackActionInterface | BaseViewActionInterface) {
        switch ((action as BaseSlackActionInterface).type) {
            case 'view_submission':
                return this[(action as BaseViewActionInterface).view.callback_id](action);
            case 'block_actions':
                const exactAction = (action as BlockActionInterface).actions[0];
                return this[exactAction.action_id](action, exactAction);
        }
    }

    public async createTask(action: CreateTaskActionInterface): Promise<Task | undefined> {
        const user = await this.userService.findBySlackId(action.user.id);
        if (user) {
            return this.taskManageService.createForUser(
                user,
                action.view.state.values.task.title.value,
            );
        }

        return null;
    }

    public async startDaily(action: BlockActionInterface, exactAction: BaseBlockActionInterface)
        : Promise<void> {
        const user = await this.userService.findBySlackId(action.user.id);
        if (user) {
            try {
                if (!(await this.dailyService.isHasCurrentDaily(user))) {
                    const tasks = await this.taskService.findUserActiveTasks(user);
                    const daily = await this.dailyService.create(user, tasks);
                    await this.slackService.updateMessage(
                        action.container,
                        await this.messageRenderService.getMessage(DailyStartedMessage),
                    );

                    if (tasks.length < 1) {
                        await this.startListenNewTasks(user, daily);
                    }

                    const promises = tasks.map(task => {
                        return new Promise(
                            async () => this.slackService.postReachMessageToChat(
                                user.imId,
                                await this.messageRenderService.getMessage(
                                    HandleTaskMessage,
                                    null,
                                    daily.id,
                                    task,
                                ),
                            ),
                        );
                    });
                    await Promise.all(promises);
                } else {
                    await this.slackService.updateMessage(
                        action.container,
                        await this.messageRenderService.getMessage(DailyAlreadyStartedMessage),
                    );
                }
            } catch (e) {
                Logger.error(e.message); // todo send exception message
            }
        }
    }

    public async postponeDaily(
        action: BlockActionInterface,
        exactAction: BaseBlockActionInterface,
    ) {
        const user = await this.userService.findBySlackId(action.user.id);
        if (user) {
            return this.slackService.updateMessage(
                action.container,
                await this.messageRenderService.getMessage(DailyPostponedMessage),
            );
        }
    }

    public async completeTask(
        action: BlockActionInterface,
        exactAction: BaseBlockActionInterface,
    ) {
        return this.handleTask(action, exactAction, TaskGroupCode.COMPLETED);
    }

    public postponeTask(
        action: BlockActionInterface,
        exactAction: BaseBlockActionInterface,
    ) {
        return this.handleTask(action, exactAction, TaskGroupCode.ACTIVE);
    }

    public cancelTask(
        action: BlockActionInterface,
        exactAction: BaseBlockActionInterface,
    ) {
        return this.handleTask(action, exactAction, TaskGroupCode.CANCELED);
    }

    protected async handleTask(
        action: BlockActionInterface,
        exactAction: BaseBlockActionInterface,
        newStatus: TaskGroupCode,
    ) {
        const dailyId = parseInt(exactAction.block_id, 10);
        const taskId = parseInt(exactAction.value, 10);

        const user = await this.userService.findBySlackId(action.user.id);
        const daily = await this.dailyService.find(dailyId);

        if (user && daily && daily.user.id === user.id) {
            const dailyToTask = await this.dailyService.findDailyTask(taskId, dailyId);
            const task = await this.taskService.find(
                taskId, {
                    relations: ['group'],
                },
            );
            let actionCode: TaskStatusEnum = null;
            if (task.group.code !== newStatus) {
                await this.dailyService.updateDailyTask(dailyToTask, newStatus);
                actionCode = newStatus;
            } else {
                await this.dailyService.postponeDailyTask(dailyToTask);
                actionCode = TaskStatus.POSTPONED;
            }

            await this.slackService.updateMessage(
                action.container,
                await this.messageRenderService.getMessage(HandledTaskMessage, null, task, actionCode),
            );
            if (!(await this.dailyService.isDailyHasUnhandledTasks(dailyId))) {
                await this.startListenNewTasks(user, daily);
            }
        }
    }

    protected async startListenNewTasks(user: User, daily: Daily): Promise<void> {
        daily.handleNewTasksTo = DateTime.local().plus({minutes: 30}); // todo вынести в конфиг
        await this.dailyService.update(daily);
        await this.slackService.postRawMessageToChat(
            user.imId,
            this.dailyHoldingService.getListenTasksMessage(),
        );
    }
}

import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {TaskService} from '../../task/task.service';
import {SlackService} from './slack.service';
import {User} from '../../user/user.entity';
import {Task} from '../../task/task.entity';

@Injectable()
export class TaskManageService {
    constructor(
        protected readonly slackService: SlackService,
        @Inject(forwardRef(() => TaskService))
        protected readonly taskService: TaskService,
    ) {}

    public async createForUser(user: User, title: string, groupId?: number): Promise<Task | undefined> {
        const task = await this.taskService.createForUser(user, title, groupId);
        await this.slackService.postRawMessageToChat(user.imId, `Task *${task.title}* successfully created!`);
        return task;
    }
}

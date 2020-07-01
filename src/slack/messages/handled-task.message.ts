import {Task} from '../../task/task.entity';
import {BaseMessage} from './base/base.message';
import {TaskStatusEnum} from '../types/message/task-status.enum';

export class HandledTaskMessage extends BaseMessage {
    private task: Task;
    private statusCode: TaskStatusEnum;

    setParams(task: Task, statusCode: TaskStatusEnum): this {
        this.task = task;
        this.statusCode = statusCode;
        return super.setParams();
    }

    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const status = await this.__(`task.handled.statuses.${this.statusCode}`);
        const message = await this.__(
            'task.handled.message',
            {title: this.task.title, status},
        );
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message,
                },
            },
        ];
    }
}

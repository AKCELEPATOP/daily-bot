import {Task} from '../../task/task.entity';
import {BaseMessage} from './base/base.message';
import {promiseProps} from '../../common/utils';

export class HandleTaskMessage extends BaseMessage {
    protected task: Task;
    protected dailyId: number;

    public setParams(dailyId:number, task: Task): this {
        this.dailyId = dailyId;
        this.task = task;
        return super.setParams();
    }

    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const actions = await promiseProps({
            complete: this.__('task.actions.complete'),
            postpone: this.__('task.actions.postpone'),
            cancel: this.__('task.actions.cancel'),
        });
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${this.task.title}*`
                }
            },
            {
                "type": "actions",
                "block_id": `${this.dailyId}`,
                "elements": [
                    {
                        "type": "button",
                        "action_id": "completeTask",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": actions.complete,
                        },
                        "style": "primary",
                        "value": `${this.task.id}`
                    },
                    {
                        "type": "button",
                        "action_id": "postponeTask",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": actions.postpone,
                        },
                        "value": `${this.task.id}`
                    },
                    {
                        "type": "button",
                        "action_id": "cancelTask",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": actions.cancel,
                        },
                        "style": "danger",
                        "value": `${this.task.id}`
                    }
                ]
            }
        ]
    }
}

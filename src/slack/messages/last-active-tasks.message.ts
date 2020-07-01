import {BaseMessage} from './base/base.message';
import {Task} from '../../task/task.entity';
import {promiseProps} from '../../common/utils';

export class LastActiveTasksMessage extends BaseMessage {
    protected tasks: Task[];
    protected otherLink: string;

    setParams(tasks: Task[], otherLink: string): this {
        this.tasks = tasks;
        this.otherLink = otherLink;
        return super.setParams();
    }

    async render(): Promise<any> {
        const attrPromise = promiseProps({
            title: this.__('task.list.title'),
            footer: this.__('task.list.footer'),
        });
        const tasksRows = this.tasks.map((task) => `:keycap_star: ${task.title}`).join('\n');
        const attr = await attrPromise;

        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${attr.title}:*`,
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": tasksRows
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `:bookmark_tabs: ${attr.footer} ${this.otherLink}`
                    }
                ]
            }
        ];
    }
}
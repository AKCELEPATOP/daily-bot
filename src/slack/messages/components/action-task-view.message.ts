import { MessageInterface } from '../../types/message/message.interface';
import { Task } from '../../../task/task.entity';

export class ActionTaskViewMessage implements MessageInterface {
    constructor(private task: Task) { }

    render() {
        return this.getPattern(this.task);
    }

    protected getPattern(task: Task) {
        return [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${task.title}*`
                }
            },
            // {
            //     "type": "section",
            //     "fields": [
            //         {
            //             "type": "mrkdwn",
            //             "text": "*Status:* In progress"
            //         },
            //         {
            //             "type": "mrkdwn",
            //             "text": "*Created:* 09 Oct 2019"
            //         }
            //     ]
            // },
            {
                "type": "actions",
                "block_id": `task-${task.id}`,
                "elements": [
                    {
                        "type": "button",
                        "action_id": "complete",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Complete"
                        },
                        "style": "primary",
                        "value": `${task.id}`
                    },
                    {
                        "type": "button",
                        "action_id": "close",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Close"
                        },
                        "style": "danger",
                        "value": `${task.id}`
                    }
                ]
            }
        ]
    }

}

import {BaseMessage} from './base/base.message';

export class NoActiveTasksMessage extends BaseMessage {
    async render(): Promise<any> {
        const message = await this.__('task.no_active_tasks');

        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message,
                }
            }
        ];
    }
}
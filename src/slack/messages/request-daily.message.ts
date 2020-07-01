import {BaseMessage} from './base/base.message';
import {promiseProps} from '../../common/utils';

export class RequestDailyMessage extends BaseMessage {
    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {

        const daily = await promiseProps({
            title: this.__('daily.request.title'),
            start: this.__('daily.request.start'),
            postpone: this.__('daily.request.postpone'),
        });
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${daily.title}*`
                }
            },
            {
                "type": "actions",
                "block_id": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": `:heavy_check_mark: ${daily.start}`
                        },
                        "style": "primary",
                        "action_id": "startDaily"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": `:x: ${daily.postpone}`
                        },
                        "style": "danger",
                        "action_id": "postponeDaily"
                    }
                ]
            }
        ];
    }
}

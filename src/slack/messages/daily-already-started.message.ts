import {BaseMessage} from './base/base.message';

export class DailyAlreadyStartedMessage extends BaseMessage {
    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const message = await this.__('daily.status.already_started');
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${message}*`
                }
            }
        ];
    }
}

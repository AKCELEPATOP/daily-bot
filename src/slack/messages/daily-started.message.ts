import {BaseMessage} from './base/base.message';

export class DailyStartedMessage extends BaseMessage {
    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const status = await this.__('daily.status.started');
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${status}*`
                }
            }
        ];
    }
}

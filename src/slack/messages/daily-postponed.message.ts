import {BaseMessage} from './base/base.message';

export class DailyPostponedMessage extends BaseMessage {
    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const status = await this.__('daily.status.postponed');
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

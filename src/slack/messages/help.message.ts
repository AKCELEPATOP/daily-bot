import {BaseMessage} from './base/base.message';
import {promiseProps} from '../../common/utils';

export class HelpMessage extends BaseMessage {

    public render(): Promise<any> {
        return this.getPattern();
    }

    public async getPattern(): Promise<any> {
        const help = await promiseProps({
            greeting: this.__('help.greeting'),
            start: this.__('help.start'),
            daily: this.__('help.daily'),
            stagesTitle: this.__('help.stages_title'),
            stageFirst: this.__('help.stage_first'),
            stageSecond: this.__('help.state_second'),
            commandsTitle: this.__('help.commands_title'),
            commandCreate: this.__('help.command_create'),
            commandList: this.__('help.command_list'),
            viewTasks: this.__('help.view_tasks', {url: process.env.APP_FRONTEND_DOMAIN}),
        });

        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.greeting,
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.start,
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.daily
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.stagesTitle,
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.stageFirst
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.stageSecond
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.commandsTitle
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.commandCreate
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": help.commandList
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
                        "text": help.viewTasks
                    }
                ]
            }
        ];
    }
}

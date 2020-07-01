import {WebClient, WebAPICallResult} from '@slack/client';
import {MessageInterface} from '../types/message/message.interface';
import {ActionContainerInterface} from '../types/action/base/action-container.interface';
import {NotFoundException, InternalServerErrorException, Injectable, Inject} from '@nestjs/common';
import {UserInterface} from '../types/model/user.interface';
import {SLACK_MODULE_OPTIONS} from '../constants';
import {SlackModuleOptionsInterface} from '../types/slack-module-options.interface';

@Injectable()
export class SlackService {
    private web: WebClient;

    constructor(
        @Inject(SLACK_MODULE_OPTIONS) options: SlackModuleOptionsInterface,
    ) {
        this.web = new WebClient(options.botToken);
    }

    /**
     * getUserById
     * @param id
     */
    public async getUserById(id: string): Promise<UserInterface | undefined> {
        const userResponse = await this.web.users.info({user: id});
        if (userResponse.error) {
            throw new NotFoundException('User not found');
        }
        return userResponse.user as UserInterface;
    }

    public async createIm(userId: string): Promise<string | undefined> {
        const {channel, error} = await this.web.im.open({user: userId});
        if (error) {
            throw new InternalServerErrorException('Failed to create private channel');
        }
        return (channel as object)['id'];
    }

    public async postRawMessageToChat(chat: string, message: string): Promise<WebAPICallResult | undefined> {
        return this.web.chat.postMessage({
            channel: chat,
            text: message,
        });
    }

    public async postEphemeralMessage(channel: string, user: string, message: MessageInterface) {
        // @ts-ignore
        return this.web.chat.postEphemeral({
            channel,
            user,
            blocks: await message.render(),
        });
    }

    public async postReachMessageToChat(chat: string, message: MessageInterface): Promise<WebAPICallResult | undefined> {
        // @ts-ignore
        return this.web.chat.postMessage({
            channel: chat,
            blocks: await message.render(),
        });
    }

    public openView(triggerId: string, view: any) {
        return this.web.views.open({
            trigger_id: triggerId,
            view,
        });
    }

    public async updateMessage(container: ActionContainerInterface, message: MessageInterface) {
        // @ts-ignore
        return this.web.chat.update({
            ts: container.message_ts,
            channel: container.channel_id,
            blocks: await message.render(),
        });
    }
}

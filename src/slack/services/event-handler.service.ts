import {Injectable} from '@nestjs/common';
import {ConfigService} from 'nestjs-config';
import {SlackEventInterface} from '../types/slack-event.interface';
import {MessageHandlerService} from './message-handler.service';

@Injectable()
export class EventHandlerService {

    constructor(
        protected readonly messageHandler: MessageHandlerService,
        protected readonly configService: ConfigService,
    ) {}

    public handle(event: SlackEventInterface) {
        if (!this.configService.get('allowed-events').includes(event.type)) {
            return;
        }
        return this[event.type](event);
    }

    protected message(event: SlackEventInterface) {
        return this.messageHandler.handle(event);
    }
}

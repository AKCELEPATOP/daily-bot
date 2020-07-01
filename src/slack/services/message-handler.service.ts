import {Injectable} from '@nestjs/common';
import {SlackEventInterface} from '../types/slack-event.interface';
import {UserService} from '../../user/user.service';
import {DailyService} from '../../daily/daily.service';
import {DailyHoldingService} from './daily-holding.service';

@Injectable()
export class MessageHandlerService {

    constructor(
        protected readonly userService: UserService,
        protected readonly dailyService: DailyService,
        protected readonly dailyHoldingService: DailyHoldingService,
    ) {
    }

    public async handle(event: SlackEventInterface): Promise<any> {
        if (event.text) {
            event.text = event.text.trim();
        }
        const user = await this.userService.findBySlackId(event.user);
        if (user && await this.dailyService.isUserAllowedCreateTasks(user)) {
            return this.dailyHoldingService.handleDailyInput(user, event);
        }
    }
}

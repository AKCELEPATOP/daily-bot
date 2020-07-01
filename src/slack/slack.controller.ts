import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {CommandHandlerService} from './services/command-handler.service';
import {EventHandlerService} from './services/event-handler.service';
import {ActionHandlerService} from './services/action-handler.service';
import {TaskManageService} from './services/task-manage.service';
import {DailyHoldingService} from './services/daily-holding.service';

@Controller('/slack')
export class SlackController {
    constructor(
        private readonly commandHandler: CommandHandlerService,
        private readonly eventHandlerService: EventHandlerService,
        private readonly actionHandler: ActionHandlerService,
        protected readonly dailyHoldingService: DailyHoldingService,
    ) {}

    @Post('/commands')
    public async handleCommand(@Req() request: Request) {
        return this.commandHandler.handle(request.body);
    }

    @Post('/events')
    public async handleEvent(@Req() request: Request) {
        const body = request.body;
        /** verify endpoint */
        if (body.type === 'url_verification') {
            return body.challenge;
        }
        return this.eventHandlerService.handle(body.event);
    }

    @Post('/actions')
    public async handleAction(@Req() request: Request, @Res() response: Response) {
        response.send();
        return this.actionHandler.handle(JSON.parse(request.body.payload));
    }
}

import {ClassSerializerInterceptor, Controller, Get, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {DateTime} from 'luxon';
import {Pagination} from '../paginate';
import {Task} from './task.entity';
import {JwtGuard} from '../auth/jwt.guard';
import {PeriodFilterInterface, TaskFilterInterface} from './interfaces';
import {TaskExplorerService} from './task-explorer.service';

@Controller('tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
    constructor(
        private readonly taskExplorerService: TaskExplorerService,
    ) {}

    @UseGuards(JwtGuard)
    @Get()
    index(@Req() req): Promise<Pagination<Task>> {
        const {
            groupId,
            self,
            user,
            dateFrom,
            dateTo,
        } = req.query;

        const params: TaskFilterInterface = {
            groupId,
            userId: (self === 'true') ? req.user.id : user,
            period: TaskController.getPeriodFromParams(dateFrom, dateTo),
            teamId: req.user.teamId,
        };
        return this.taskExplorerService.paginate(
            params,
            {
                limit: req.query.hasOwnProperty('limit') ? req.query.limit : 10,
                page: req.query.hasOwnProperty('page') ? req.query.page : 0,
            },
        );
    }

    private static getPeriodFromParams(dateFromStr: string, dateToStr: string): PeriodFilterInterface | null {
        if (!dateFromStr && !dateToStr) {
            return null;
        }

        const period: PeriodFilterInterface = {};
        if (dateFromStr) {
            period.dateFrom = DateTime.fromISO(dateFromStr);
        }
        if (dateToStr) {
            period.dateTo = DateTime.fromISO(dateToStr);
        }

        return period;
    }
}

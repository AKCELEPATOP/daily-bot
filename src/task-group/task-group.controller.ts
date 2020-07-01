import {ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors} from '@nestjs/common';
import {TaskGroupService} from './task-group.service';
import {JwtGuard} from '../auth/jwt.guard';
import {TaskGroup} from './task-group.entity';

@Controller('task-groups')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskGroupController {
    constructor(
        protected readonly taskGroupService: TaskGroupService,
    ) {}

    @Get()
    @UseGuards(JwtGuard)
    index(): Promise<TaskGroup[]> {
        return this.taskGroupService.getList();
    }
}

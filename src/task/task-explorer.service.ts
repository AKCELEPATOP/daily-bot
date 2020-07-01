import {Injectable} from '@nestjs/common';
import {TaskService} from './task.service';
import {PaginateService, Pagination, PaginationOptionsInterface} from '../paginate';
import {TaskFilterInterface} from './interfaces';
import {Task} from './task.entity';

@Injectable()
export class TaskExplorerService {
    constructor(
        protected readonly taskService: TaskService,
        protected readonly paginateService: PaginateService,
    ) {}

    public async paginate(
        filter: TaskFilterInterface,
        options: PaginationOptionsInterface,
    ): Promise<Pagination<Task>> {

        return await this.paginateService.paginate<Task>(
            this.taskService.getAllQueryBuilder(filter),
            options,
        );
    }
}

import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {TaskGroup} from './task-group.entity';

@Injectable()
export class TaskGroupService {
    constructor(
        @InjectRepository(TaskGroup)
        protected readonly repository: Repository<TaskGroup>,
    ) {}

    public getList(): Promise<TaskGroup[] | undefined> {
        return this.repository.find({
            order: {
                order: 'ASC',
            },
        });
    }

    public getByCode(code: string): Promise<TaskGroup | undefined> {
        return this.repository.findOne({code});
    }
}

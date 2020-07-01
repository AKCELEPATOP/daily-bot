import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Task} from './task.entity';
import {User} from '../user/user.entity';
import {Injectable} from '@nestjs/common';
import {TaskFilterInterface} from './interfaces';
import * as _ from 'lodash';
import {AnalysisService} from '../mystem/analysis.service';
import {TagService} from '../tag/tag.service';
import tagConstants from '../tag/constants';
import {TaskGroupService} from '../task-group/task-group.service';
import {TaskGroupCode} from '../task-group/task-group.enum';
import {TypeormQueryBuilderService} from '../typeorm-query-builder/typeorm-query-builder.service';
import {SelectBuilderOptionsInterface} from '../typeorm-query-builder/interfaces/select-builder-options.interface';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        protected readonly repository: Repository<Task>,
        protected readonly analysisService: AnalysisService,
        protected readonly tagService: TagService,
        protected readonly taskGroupService: TaskGroupService,
        protected readonly queryBuilderService: TypeormQueryBuilderService,
    ) {
    }

    public async create(taskData: Task): Promise<Task | undefined> {
        const task = await this.repository.save(taskData);
        if (task) {
            this.addSmartTag(task);
        }

        return task;
    }

    public async createForUser(user: User, title: string, groupId?: number): Promise<Task | undefined> {
        if (!groupId) {
            const activeGroup = await this.taskGroupService.getByCode(TaskGroupCode.ACTIVE);
            if (!activeGroup) {
                throw new Error('No active group');
            }
            groupId = activeGroup.id;
        }

        const task = new Task();
        task.title = title;
        task.user = user;
        task.groupId = groupId;
        return this.create(task);
    }

    public find(id: number, options: SelectBuilderOptionsInterface<Task> = null): Promise<Task | undefined> {
        const builder = this.repository.createQueryBuilder('task')
            .where('task.id = :id', {id});
        this.queryBuilderService.getIndexQuery(builder, options);
        return builder.getOne();
    }

    public findLastActiveForUser(user: User, take: number = 10): Promise<Task[] | undefined> {
        return this.repository.find({
            join: {alias: 'tasks', innerJoin: {group: 'tasks.group'}},
            where: qb => {
                qb.where({
                    user,
                }).andWhere('group.code = :code', {code: TaskGroupCode.ACTIVE});
            },
            order: {
                createdAt: 'DESC',
            },
            take,
        });
    }

    /**
     * @deprecated
     * @param options
     */
    public findAll(options: SelectBuilderOptionsInterface<Task> = null): Promise<Task[] | undefined> {
        const builder = this.repository.createQueryBuilder('task');
        this.queryBuilderService.getIndexQuery(builder, options);
        return builder.getMany();
    }

    public findUserActiveTasks(user: User): Promise<Task[] | undefined> {
        return this.repository.find({
            join: {alias: 'tasks', innerJoin: {group: 'tasks.group'}},
            where: qb => {
                qb.where({
                    user,
                }).andWhere('group.code = :code', {code: TaskGroupCode.ACTIVE});
            },
        });
    }

    public getAllQueryBuilder(filter: TaskFilterInterface): SelectQueryBuilder<Task> {
        const query = this.repository.createQueryBuilder('t')
            .innerJoinAndSelect('t.user', 'u')
            .innerJoinAndSelect('t.tags', 'tag'); // todo добавить конфигурируемость для связей

        if (!_.isNil(filter.teamId)) {
            query.andWhere('u.team_id = :teamId', {teamId: filter.teamId});
        }
        if (!_.isNil(filter.groupId)) {
            query.andWhere('t.groupId = :groupId', {groupId: filter.groupId});
        }
        if (!_.isNil(filter.userId)) {
            query.andWhere('t."userId" = :userId', {userId: filter.userId});
        }
        if (!_.isNil(filter.period)) {
            if (!_.isNil(filter.period.dateFrom)) {
                query.andWhere(
                    't.created_at >= :dateFrom',
                    {dateFrom: filter.period.dateFrom.toJSDate()},
                );
            }
            if (!_.isNil(filter.period.dateTo)) {
                query.andWhere(
                    't.created_at < :dateTo',
                    {dateTo: filter.period.dateTo.toJSDate()},
                );
            }
        }

        return query;
    }

    private async addSmartTag(task: Task): Promise<Task | undefined> {
        const smart = await this.analysisService.hasPfVerbs(task.title);
        const code = (smart) ? tagConstants.CODE_SMART : tagConstants.CODE_CLUMSY;
        const tag = await this.tagService.getByCode(code);
        if (task.tags) {
            task.tags.push(tag);
        } else {
            task.tags = [tag];
        }

        return this.repository.save(task);
    }
}

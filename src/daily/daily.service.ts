import {InjectConnection, InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {Connection, EntityManager, Repository, UpdateResult} from 'typeorm';
import {DateTime} from 'luxon';
import {Injectable} from '@nestjs/common';
import {ConfigService} from 'nestjs-config';
import {Daily} from './daily.entity';
import {Task} from '../task/task.entity';
import {User} from '../user/user.entity';
import {DailyToTask} from './daily-to-task.entity';
import {TaskGroupService} from '../task-group/task-group.service';
import {TaskGroupCode} from '../task-group/task-group.enum';

@Injectable()
export class DailyService {
    constructor(
        @InjectRepository(Daily)
        protected readonly dailyRepository: Repository<Daily>,
        @InjectRepository(DailyToTask)
        protected readonly dailyToTaskRepository: Repository<DailyToTask>,
        @InjectEntityManager()
        protected readonly entityManager: EntityManager,
        @InjectConnection()
        protected readonly connection: Connection,
        protected readonly configService: ConfigService,
        protected readonly taskGroupService: TaskGroupService,
    ) {
    }

    public async create(user: User, tasks: Task[]): Promise<Daily | undefined> {
        const daily = new Daily();
        daily.user = user;

        await this.entityManager.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(daily);
            const dailyToTasks = tasks.map(item => {
                const dailyToTask = new DailyToTask();
                dailyToTask.daily = daily;
                dailyToTask.task = item;
                return dailyToTask;
            });
            await transactionalEntityManager.save(dailyToTasks);
        });

        return daily;
    }

    public find(id: number) {
        return this.dailyRepository.findOne(id, {relations: ['user']});
    }

    public async update(daily: Daily): Promise<Daily | undefined> {
        await this.dailyRepository.update(daily.id, daily);
        return daily;
    }

    public findDailyTask(taskId: number, dailyId: number): Promise<DailyToTask | undefined> {
        return this.dailyToTaskRepository.findOne({
            where: {
                taskId,
                dailyId,
            },
        });
    }

    public async updateDailyTask(dailyToTask: DailyToTask, code: TaskGroupCode): Promise<DailyToTask | undefined> {
        const completeGroup = await this.taskGroupService.getByCode(code);
        await this.entityManager.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.createQueryBuilder()
                .update(DailyToTask)
                .set({handled: true})
                .where(
                    'taskId = :taskId AND dailyId = :dailyId',
                    {taskId: dailyToTask.taskId, dailyId: dailyToTask.dailyId},
                )
                .execute();

            await this.entityManager
                .createQueryBuilder()
                .update(Task)
                .set({groupId: completeGroup.id})
                .where('id = :id', {id: dailyToTask.taskId})
                .execute();
        });
        return dailyToTask;
    }

    public async postponeDailyTask(dailyToTask: DailyToTask): Promise<DailyToTask | undefined> {
        await this.entityManager.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.createQueryBuilder()
                .update(DailyToTask)
                .set({handled: true})
                .where(
                    'taskId = :taskId AND dailyId = :dailyId',
                    {taskId: dailyToTask.taskId, dailyId: dailyToTask.dailyId},
                )
                .execute();
        });
        return dailyToTask;
    }

    public async isDailyHasUnhandledTasks(dailyId: number) {
        const tasks = await this.dailyToTaskRepository
            .createQueryBuilder('dt')
            .where(
                'dt.dailyId = :dailyId and dt.handled = :handled',
                {dailyId, handled: false},
            )
            .execute();
        return tasks.length > 0;
    }

    public async isUserAllowedCreateTasks(user: User) {
        const allowedTo = await this.dailyRepository.createQueryBuilder('d')
            .select('MAX(d.handle_new_task_to)', 'max')
            .where('d."userId" = :id', {id: user.id})
            .groupBy('d."userId"')
            .getRawOne();

        return (allowedTo.max > (new Date()));
    }

    public async lockCreateNewTasks(user: User): Promise<UpdateResult> {
        return this.dailyRepository.createQueryBuilder()
            .update(Daily)
            .set({handleNewTasksTo: null})
            .where({userId: user.id})
            .execute();
    }

    public async getUsersForDaily() {
        const qb = await this.connection.createQueryBuilder();

        const now = DateTime.local().startOf('hour');
        const notifyFrom = this.configService.get('notifications.time.hourFrom');
        const notifyTo = this.configService.get('notifications.time.hourTo');

        /** We don’t notify anyone on the weekend */
        if (this.configService.get('notifications.weekends').includes(now.weekday)) {
            // todo holidays
            return [];
        }

        return (await qb
            .select('u.im_id, u.tz')
            .select('u.im_id, u.tz')
            .from(qb.subQuery()
                    .select('u.im_id, u.tz, MAX(d.created_at) as last_date')
                    .from(User, 'u')
                    .leftJoin('u.dailies', 'd')
                    .groupBy('u.id')
                    .getQuery(),
                'u',
            )
            .andWhere('u.last_date < current_date')
            .orWhere('u.last_date IS NULL')
            .getRawMany())
            // Notify only at a given time interval
            .filter(user => {
                const userLocalHour = now.setZone(user.tz).hour;
                return userLocalHour >= notifyFrom
                    && userLocalHour <= notifyTo;
            })
            .map(user => user.im_id);
    }

    public async isHasCurrentDaily(user: User) {
        const lastDaily = await this.dailyRepository.createQueryBuilder('d')
            .select('MAX(d.created_at) as last_date')
            .groupBy('d."userId"')
            .where('d."userId" = :id', {id: user.id})
            .getRawOne();
        const userLocal = DateTime.local().setZone(user.tz);

        return lastDaily ? userLocal.hasSame(DateTime.fromJSDate(lastDaily.last_date), 'day')
            : false;
    }
}

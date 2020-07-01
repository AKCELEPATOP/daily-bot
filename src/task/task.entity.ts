import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import {Type, Exclude} from 'class-transformer';
import {User} from '../user/user.entity';
import {DailyToTask} from '../daily/daily-to-task.entity';
import {Tag} from '../tag/tag.entity';
import {TaskGroup} from '../task-group/task-group.entity';

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @CreateDateColumn({
        nullable: false,
        name: 'created_at',
    })
    createdAt: Date;

    @Column({
        name: 'last_invoiced',
        default: () => `now()`,
    })
    @Exclude()
    lastInvoiced: Date;

    @Column({ name: 'group_id', nullable: true })
    @JoinColumn()
    groupId: number;

    @ManyToOne(type => User, user => user.tasks, {nullable: false})
    @Type(() => User)
    user: User;

    @ManyToOne(type => TaskGroup, taskGroup => taskGroup.tasks)
    @JoinColumn({name: 'group_id'})
    @Type(() => TaskGroup)
    group: TaskGroup;

    @OneToMany(type => DailyToTask, dailyToTask => dailyToTask.task)
    public dailyToTasks: DailyToTask[];

    @ManyToMany(type => Tag, tag => tag.tasks)
    @JoinTable()
    @Type(() => Tag)
    tags: Tag[];

    @Exclude()
    handled: boolean;
}

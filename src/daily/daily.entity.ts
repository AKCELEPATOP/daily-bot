import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
    JoinTable,
} from 'typeorm';
import {User} from '../user/user.entity';
import {DailyToTask} from './daily-to-task.entity';

@Entity()
export class Daily {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.dailies, {nullable: false})
    user: User;

    @CreateDateColumn({
        nullable: false,
        name: 'created_at',
    })
    createdAt: Date;

    @Column({name: 'handle_new_task_to', nullable: true})
    handleNewTasksTo: Date;

    @OneToMany(type => DailyToTask, dailyToTask => dailyToTask.daily)
    dailyToTasks!: DailyToTask[];
}

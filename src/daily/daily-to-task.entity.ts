import {Entity, Column, ManyToOne} from 'typeorm';
import {Daily} from './daily.entity';
import {Task} from '../task/task.entity';

@Entity()
export class DailyToTask {

    @Column({default: false})
    handled: boolean;

    @Column({primary: true})
    dailyId: number;

    @Column({primary: true})
    taskId: number;

    @ManyToOne(type => Daily, daily => daily.dailyToTasks)
    daily: Daily;

    @ManyToOne(type => Task, task => task.dailyToTasks)
    task: Task;
}

import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Exclude} from 'class-transformer';
import {Task} from '../task/task.entity';

@Entity()
export class TaskGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({unique: true})
    code: string;

    @Column()
    name: string;

    @OneToMany(type => Task, task => task.group)
    tasks: Task[];

    @Column()
    @Exclude()
    order: number;
}

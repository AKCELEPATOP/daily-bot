import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from 'typeorm';
import {Exclude} from 'class-transformer';
import {Task} from '../task/task.entity';

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({nullable: false})
    code: string;

    @ManyToMany(type => Task, task => task.tags)
    tasks: Task[];
}

import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {Exclude, Expose} from 'class-transformer';
import { Team } from '../team/team.entity';
import { Task } from '../task/task.entity';
import { Daily } from '../daily/daily.entity';

@Entity()
@Exclude()
export class User {

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({
        name: 'slack_id',
    })
    slackId: string;

    @Column({
        name: 'im_id',
    })
    imId: string;

    @Column()
    @Expose()
    name: string;

    @Column({
        name: 'real_name',
    })
    @Expose()
    realName: string;

    @Column()
    tz: string;

    @Column({
        name: 'tz_offset',
    })
    tzOffset: number;

    @Column({ name: 'team_id' })
    @JoinColumn()
    teamId: number;

    @ManyToOne(type => Team, team => team.users)
    @JoinColumn({name: 'team_id'})
    team: Team;

    @OneToMany(type => Task, task => task.user)
    tasks: Task[];

    @OneToMany(type => Daily, daily => daily.user)
    dailies: Daily[];

    @Column({name: 'next_daily'})
    nextDaily: Date;
}

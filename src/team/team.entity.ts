import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'slack_id',
    })
    @Index({ unique: true })
    slackId: string;

    @OneToMany(type => User, user => user.team)
    users: User[];
}

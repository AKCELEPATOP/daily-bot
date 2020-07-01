import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(Team)
        protected repository: Repository<Team>,
    ) {}

    public async findBySlackId(slackId: string): Promise<Team | undefined> {
        return this.repository.findOne({ slackId });
    }

    public create(teamData: Team): Promise<Team | undefined> {
        return this.repository.save(teamData);
    }
}

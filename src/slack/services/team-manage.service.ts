import {Injectable} from '@nestjs/common';
import {User} from '../../user/user.entity';
import {Team} from '../../team/team.entity';
import {UserService} from '../../user/user.service';
import {TeamService} from '../../team/team.service';
import {SlackService} from './slack.service';

@Injectable()
export class TeamManageService {

    constructor(
        protected readonly userService: UserService,
        protected readonly teamService: TeamService,
        protected readonly slackService: SlackService,
    ) {}

    public async createUserIfNotExists(userId: string): Promise<User | undefined> {
        const user = await this.userService.findBySlackId(userId);
        if (user) {
            return user;
        }
        return this.createUser(userId);
    }

    public async createTeamIfNotExists(slackId: string): Promise<Team | undefined> {
        let team = await this.teamService.findBySlackId(slackId);
        if (team) {
            return team;
        }

        team = new Team();
        team.slackId = slackId;
        return this.teamService.create(team);
    }

    public async createUser(userId: string): Promise<User | undefined> {
        const userData = await this.slackService.getUserById(userId);
        if (!userData) {
            return null;
        }
        const team: Team = await this.createTeamIfNotExists(userData.team_id);

        const newUser = new User();
        newUser.slackId = userId;
        newUser.name = userData.name;
        newUser.realName = userData.real_name;
        newUser.tz = userData.tz;
        newUser.tzOffset = userData.tz_offset;
        newUser.team = team;
        newUser.imId = await this.slackService.createIm(userId);

        return this.userService.create(newUser);
    }
}

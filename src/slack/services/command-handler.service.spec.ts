import {Test, TestingModule} from '@nestjs/testing';
import {getConnectionToken, getEntityManagerToken, getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserService} from '../../user/user.service';
import {User} from '../../user/user.entity';
import {CommandHandlerService} from './command-handler.service';
import {SlackService} from './slack.service';
import {ConfigModule, ConfigService} from 'nestjs-config';
import {SearchModule} from '../../search/search.module';
import {Task} from '../../task/task.entity';
import {MessageRenderService} from './message-render.service';
import {TaskService} from '../../task/task.service';
import {DailyHoldingService} from './daily-holding.service';
import {TeamManageService} from './team-manage.service';
import {TeamService} from '../../team/team.service';
import {Team} from '../../team/team.entity';
import {SLACK_MODULE_OPTIONS} from '../constants';
import * as path from 'path';
import {I18nJsonParser, I18nModule} from 'nestjs-i18n';
import {MyStemModule} from '../../mystem/my-stem.module';
import {TaskGroup} from '../../task-group/task-group.entity';
import {TypeormQueryBuilderModule} from '../../typeorm-query-builder/typeorm-query-builder.module';
import {TagService} from '../../tag/tag.service';
import {TaskGroupService} from '../../task-group/task-group.service';
import {TaskManageService} from './task-manage.service';
import {DailyService} from '../../daily/daily.service';
import {Daily} from '../../daily/daily.entity';
import {DailyToTask} from '../../daily/daily-to-task.entity';
import {Tag} from '../../tag/tag.entity';
import {UserInterface} from '../types/model/user.interface';

describe('CommandHandlerService', () => {
    let commandHandlerService: CommandHandlerService;
    let slackService: SlackService;
    let dailyHoldingService: DailyHoldingService;
    let configService: ConfigService;
    let userService: UserService;

    let userRepository: Repository<User>;
    let taskRepository: Repository<Task>;
    let teamRepository: Repository<Team>;
    let taskGroupRepository: Repository<TaskGroup>;
    let dailyRepository: Repository<Daily>;
    let dailyToTaskRepository: Repository<DailyToTask>;
    let tagRepository: Repository<Tag>;

    const userResponse: UserInterface = {
        team_id: 'test',
        id: 'test',
        name: 'test',
        real_name: 'test',
        tz: 'Europe/Samara',
        tz_offset: 14400,
    };
    const imId = 'test';
    const user: User = Object.assign(new User(), {
        id: 1,
        imId,
        name: userResponse.name,
        teamId: 1,
        realName: userResponse.real_name,
        slackId: userResponse.id,
        tz: userResponse.tz,
        tzOffset: userResponse.tz_offset,
    });

    const team: Team = Object.assign(new Team(), {
        id: 1,
        slackId: userResponse.team_id,
    });

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                SearchModule,
                ConfigModule.load(path.resolve(__dirname, '../..', 'config', '**', '!(*.d).{ts,js}')),
                I18nModule.forRoot({
                    fallbackLanguage: 'en',
                    parser: I18nJsonParser,
                    parserOptions: {
                        path: path.join(path.resolve(__dirname, '../..'), '/i18n/'),
                    },
                }),
                MyStemModule.register({}),
                TypeormQueryBuilderModule,
            ],
            providers: [
                UserService,
                CommandHandlerService,
                SlackService,
                MessageRenderService,
                TaskService,
                DailyHoldingService,
                TeamManageService,
                TaskGroupService,
                DailyService,
                TaskManageService,
                TagService,
                TeamService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Task),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Team),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(TaskGroup),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Daily),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(DailyToTask),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Tag),
                    useClass: Repository,
                },
                {
                    provide: getEntityManagerToken(),
                    useClass: Repository,
                },
                {
                    provide: getConnectionToken(),
                    useClass: Repository,
                },
                {
                    provide: SLACK_MODULE_OPTIONS,
                    useValue: {botToken: 'test'},
                },
            ],
        }).compile();

        userRepository = app.get(getRepositoryToken(User));
        taskRepository = app.get(getRepositoryToken(Task));
        teamRepository = app.get(getRepositoryToken(Team));
        taskGroupRepository = app.get(getRepositoryToken(TaskGroup));
        dailyRepository = app.get(getRepositoryToken(Daily));
        dailyToTaskRepository = app.get(getRepositoryToken(DailyToTask));
        tagRepository = app.get(getRepositoryToken(Tag));

        commandHandlerService = app.get(CommandHandlerService);
        slackService = app.get(SlackService);
        dailyHoldingService = app.get(DailyHoldingService);
        configService = app.get(ConfigService);
        userService = app.get(UserService);
    });

    it('should be defined', () => {
        expect(commandHandlerService).toBeDefined();
    });

    it('should create user', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
        const userSaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
        jest.spyOn(teamRepository, 'findOne').mockResolvedValueOnce(team);
        jest.spyOn(teamRepository, 'findOne').mockResolvedValueOnce(team);
        const slackSpy = jest.spyOn(slackService, 'postRawMessageToChat').mockResolvedValueOnce(undefined);
        jest.spyOn(slackService, 'getUserById').mockResolvedValueOnce(userResponse);
        jest.spyOn(slackService, 'createIm').mockResolvedValueOnce(imId);
        const dailyHoldingSpy = jest.spyOn(dailyHoldingService, 'sendDailyReminder').mockResolvedValueOnce(undefined);

        expect(await commandHandlerService.handle({
            channel_name: '',
            response_url: '',
            team_domain: '',
            team_id: userResponse.team_id,
            token: '',
            trigger_id: '',
            user_name: userResponse.name,
            user_id: userResponse.id,
            command: '/go',
            text: 'start',
            channel_id: '',
        })).toEqual(configService.get('responses.user_registered_message'));
        const {teamId, id, ...userAttr} = user;
        const resultUser = Object.assign(new User(), userAttr, {team});
        expect(userSaveSpy).toHaveBeenCalledTimes(1);
        expect(userSaveSpy).toHaveBeenLastCalledWith(resultUser);
        expect(slackSpy).toHaveBeenCalledTimes(1);
        expect(dailyHoldingSpy).toHaveBeenCalledTimes(1);
    });
});

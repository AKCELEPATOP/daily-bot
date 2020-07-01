import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserService} from './user.service';
import {User} from './user.entity';
import {Repository} from 'typeorm';
import {SearchService} from '../search/search.service';

describe('UserService', () => {
    let userService: UserService;
    let repo: Repository<User>;
    const user: User = {
        id: 1,
        imId: 'test',
        name: 'test',
        teamId: 1,
        realName: 'test',
        slackId: 'test',
        tz: 'Europe/Samara',
        tzOffset: 14400,
        dailies: [], nextDaily: undefined, tasks: [], team: undefined,
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                SearchService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        userService = app.get(UserService);
        repo = app.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create user', async () => {
        jest.spyOn(repo, 'save').mockResolvedValueOnce(user);
        expect(await userService.create(user)).toEqual(user);
    });

    it('should find user by id', async () => {
        jest.spyOn(repo, 'findOne').mockImplementationOnce(async ({id}) => {
            return id === user.id ? user : undefined;
        });
        expect(await userService.findById(1)).toEqual(user);
    });

    it('should find user by slack id', async () => {
        jest.spyOn(repo, 'findOne').mockImplementationOnce(async ({slackId}) => {
            return slackId === user.slackId ? user : undefined;
        });
        expect(await userService.findBySlackId('test')).toEqual(user);
    });
});

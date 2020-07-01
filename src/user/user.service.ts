import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Like, SelectQueryBuilder} from 'typeorm';
import {User} from './user.entity';
import {Injectable} from '@nestjs/common';
import {SearchService} from '../search/search.service';
import {FilterOptionsInterface} from './interfaces/filter-options.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected readonly repository: Repository<User>,
        protected readonly searchService: SearchService,
    ) {
    }

    public async findBySlackId(slackId: string): Promise<User | undefined> {
        return this.repository.findOne({slackId});
    }

    public async findById(id: number): Promise<User | undefined> {
        return this.repository.findOne({id});
    }

    public create(userData: User): Promise<User | undefined> {
        return this.repository.save(userData);
    }

    public getList(options: FilterOptionsInterface): Promise<User[] | undefined> {
        let builder = this.repository.createQueryBuilder('u');
        if (options.search) {
            builder = this.appendSearchToBuilder(builder, 'u', options.search);
        }

        return builder.getMany();
    }

    public findUserByName(searchString: string): Promise<User[] | undefined> {
        const builder = this.appendSearchToBuilder(
            this.repository.createQueryBuilder('u'),
            'u',
            searchString,
        );

        return builder.getMany();
    }

    protected appendSearchToBuilder(
        builder: SelectQueryBuilder<User>,
        alias: string,
        searchString: string,
    ): SelectQueryBuilder<User> {
        return this.searchService.search(
            builder,
            {
                searchField: `${alias}.real_name`,
                searchString,
                maxWordCount: 2,
            },
        );
    }
}

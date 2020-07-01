import {Tag} from './tag.entity';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        protected readonly repository: Repository<Tag>,
    ) {
    }

    getByCode(code: string): Promise<Tag | undefined> {
        return this.repository.findOne({code});
    }
}

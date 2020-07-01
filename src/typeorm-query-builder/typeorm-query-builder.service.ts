import {SelectQueryBuilder} from 'typeorm';
import {Relations, SelectBuilderOptionsInterface, Where} from './interfaces/select-builder-options.interface';
import {Injectable} from '@nestjs/common';

// планировалось добавить возможность фильтрации, но, скорее всего, забил)
@Injectable()
export class TypeormQueryBuilderService {
    public getIndexQuery<T extends object>(
        builder: SelectQueryBuilder<T>,
        options: SelectBuilderOptionsInterface<T>,
    ): SelectQueryBuilder<T> {
        if (options.relations) {
            builder = this.addRelations(builder, options.relations);
        }
        if (options.where) {
            builder = this.addWhere(builder, options.where);
        }

        if (options.skip) {
            builder.skip(options.skip);
        }

        if (options.take) {
            builder.take(options.take);
        }

        return builder;
    }

    private addRelations<T extends object>(
        builder: SelectQueryBuilder<T>,
        relations: Relations<T>,
    ): SelectQueryBuilder<T> {
        for (const key of relations) {
            builder.innerJoinAndSelect(`${builder.alias}.${key}`, key);
        }
        return builder;
    }

    private addWhere<T extends object>(
        builder: SelectQueryBuilder<T>,
        where: Array<Where<T>>,
    ): SelectQueryBuilder<T> {
        for (const cond of where) {
            builder.where(cond);
        }
        return builder;
    }
}

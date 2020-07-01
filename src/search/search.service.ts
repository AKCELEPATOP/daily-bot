import {Injectable} from '@nestjs/common';
import {SelectQueryBuilder} from 'typeorm';
import {SearchOptionsInterface} from './interfaces/search-options.interface';

@Injectable()
export class SearchService {
    public search<T>(
        builder: SelectQueryBuilder<T>,
        options: SearchOptionsInterface,
    ): SelectQueryBuilder<T> {
        const searchString = this.escapeDbSearchString(options.searchString);
        let words = searchString.split(' ');
        if (options.maxWordCount && words.length > options.maxWordCount) {
            words = words.slice(0, options.maxWordCount);
        }
        if (words.length) {
            words.forEach((word) => {
                if (word) {
                    builder.where(
                        `${options.searchField} ILIKE :search`,
                        {search: `%${word}%`},
                    ); // todo с ростом пользователей лучше перейти на elasticsearch
                }
            });
        }

        return builder;
    }

    protected escapeDbSearchString(source: string): string {
        return source.replace(/[\x08\x09\x1a\n\r"'\\\%_]/g, (char) => {
            switch (char) {
                case '\x08':
                    return '\\b';
                case '\x09':
                    return '\\t';
                case '\x1a':
                    return '\\z';
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case '\'':
                case `'`:
                case '\\':
                case '_':
                case '%':
                    return '\\' + char;
                default:
                    return char;
            }
        });
    }
}

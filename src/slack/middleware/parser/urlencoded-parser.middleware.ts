import {Injectable} from '@nestjs/common';
import {ParserMiddleware} from './parser.middleware';
import * as qs from 'qs';
import typeis from 'type-is';
import {AppRequestInterface} from '../../../common/interfaces/app-request.interface';

@Injectable()
export class UrlencodedParserMiddleware extends ParserMiddleware {
    parse(body: string): any {
        return qs.parse(body);
    }

    shouldApply(req: AppRequestInterface): boolean {
        return typeis(req, 'application/x-www-form-urlencoded');
    }
}

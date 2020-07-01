import {Injectable} from '@nestjs/common';
import {ParserMiddleware} from './parser.middleware';
import typeis from 'type-is';
import {AppRequestInterface} from '../../../common/interfaces/app-request.interface';

@Injectable()
export class JsonParserMiddleware extends ParserMiddleware {
    parse(body: string): any {
        return JSON.parse(body);
    }

    shouldApply(req: AppRequestInterface): boolean {
        return typeis(req, 'application/json');
    }
}

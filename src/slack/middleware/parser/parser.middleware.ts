import {NestMiddleware} from '@nestjs/common';
import {NextFunction, Response} from 'express';
import {AppRequestInterface} from '../../../common/interfaces/app-request.interface';

export abstract class ParserMiddleware implements NestMiddleware {
    use(req: AppRequestInterface, res: Response, next: NextFunction): any {
        if (!req.bodyParsed && req.body && this.shouldApply(req)) {
            req.body = this.parse(req.body);
            req.bodyParsed = true;
        }
        next();
    }

    abstract shouldApply(req: AppRequestInterface): boolean;

    abstract parse(body: string): any;
}

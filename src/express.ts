import express, {NextFunction, Response} from 'express';
import {AppRequestInterface} from './common/interfaces/app-request.interface';

const instance = express();
/**
 * Sets the bodyParser ignore flag for the SlackController
 * @param req
 * @param res
 * @param next
 */
const bodyParserCondition = (req: AppRequestInterface, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/slack/')) {
        req._body = true;
    }
    next();
};

const parserMiddleware = {
    bodyParserCondition,
};
Object.keys(parserMiddleware)
    .forEach(parserKey => instance.use(parserMiddleware[parserKey]));

export {instance};

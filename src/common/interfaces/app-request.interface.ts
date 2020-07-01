import {Request} from 'express';

export interface AppRequestInterface extends Request {
    /** BodyParser body parsed flag */
    _body?: boolean;
    /** Application body parsed flag */
    bodyParsed?: boolean;
}

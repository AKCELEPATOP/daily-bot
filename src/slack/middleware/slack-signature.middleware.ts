import {BadRequestException, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import rawbody from 'raw-body';
import * as crypto from 'crypto';

@Injectable()
export class SlackSignatureMiddleware implements NestMiddleware {
    private readonly slackSigningSecret: string = process.env.SLACK_SIGNING_SECRET;

    async use(req: Request, res: Response, next: NextFunction) {
        const slackSignature = req.headers['x-slack-signature'].toString();
        if (!req.readable) {
            next(new Error('Request body has already been read'));
        }
        req.body = (await rawbody(req)).toString().trim();
        const requestBody = req.body;
        const timestamp = +req.headers['x-slack-request-timestamp'];
        const time = Math.floor(new Date().getTime() / 1000);
        if (Math.abs(time - timestamp) > 300) {
            throw new BadRequestException('Ignore this request.');
        }
        if (!this.slackSigningSecret) {
            throw new BadRequestException('Slack signing secret is empty.');
        }
        const sigBaseString = 'v0:' + timestamp + ':' + requestBody;
        const mySignature = 'v0=' +
            crypto.createHmac('sha256', this.slackSigningSecret)
                .update(sigBaseString, 'utf8')
                .digest('hex');
        if (crypto.timingSafeEqual(
            Buffer.from(mySignature, 'utf8'),
            Buffer.from(slackSignature, 'utf8'))
        ) {
            next();
        } else {
            throw new BadRequestException('Verification failed');
        }
    }
}

import {Controller, Next, NotFoundException, Post, Req, Res} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {authenticate} from 'passport';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from 'nestjs-config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
    }

    @Post('slack/callback')
    async handleOAuthCallback(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ) {
        if (!req.query.code && req.body.code) {
            req.query.code = req.body.code;
        }

        authenticate('slack', {session: false}, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new NotFoundException(this.configService.get('responses.register_required')));
            }

            const token = this.jwtService.sign(
                {id: user.id, name: user.realName, teamId: user.teamId},
            );
            res.json({access_token: token});
        })(req, res, next);
    }
}

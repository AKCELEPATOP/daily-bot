import {Strategy} from 'passport-slack';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {AuthService} from './auth.service';

@Injectable()
export class SlackStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super(
            {
                clientID: process.env.SLACK_CLIENT_ID,
                clientSecret: process.env.SLACK_CLIENT_SECRET,
                callbackURL: process.env.SLACK_REDIRECT_URL,
                scope: ['client'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await authService.handlePassportAuth(profile);
                    done(null, user);
                } catch (e) {
                    done(e);
                }
            },
        );
    }

}

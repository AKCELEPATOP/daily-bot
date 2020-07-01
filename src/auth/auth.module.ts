import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {UserModule} from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import {AuthService} from './auth.service';
import {SlackStrategy} from './slack.strategy';
import {AuthController} from './auth.controller';
import {ConfigService} from 'nestjs-config';
import {JwtStrategy} from './jwt.strategy';
import {JwtGuard} from './jwt.guard';

@Module({
    imports: [
        UserModule,
        PassportModule.register({defaultStrategy: 'jwt', session: false}),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                ...configService.get('jwt-options'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, SlackStrategy, JwtStrategy, JwtGuard],
    exports: [AuthService, JwtGuard],
})
export class AuthModule {}

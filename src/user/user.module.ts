import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.entity';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {SearchModule} from '../search/search.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        SearchModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}

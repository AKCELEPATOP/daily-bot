import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException, Param,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {UserService} from './user.service';
import {JwtGuard} from '../auth/jwt.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(JwtGuard)
    @Get('info')
    info(@Request() req) {
        return this.userService.findById(req.user.id);
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    async getOne(@Param('id') id: number) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(JwtGuard)
    @Get()
    index(@Request() req) {
        return this.userService.getList(req.query); // todo прикрутить пагинацию
    }
}

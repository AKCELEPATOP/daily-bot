import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SearchModule} from '../search/search.module';
import {TaskGroup} from './task-group.entity';
import {TaskGroupController} from './task-group.controller';
import {TaskGroupService} from './task-group.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskGroup]),
        SearchModule,
    ],
    controllers: [TaskGroupController],
    providers: [TaskGroupService],
    exports: [TaskGroupService],
})
export class TaskGroupModule {}

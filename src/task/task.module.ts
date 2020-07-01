import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {TaskService} from './task.service';
import {TaskController} from './task.controller';
import {TagModule} from '../tag/tag.module';
import {TaskGroupModule} from '../task-group/task-group.module';
import {TypeormQueryBuilderModule} from '../typeorm-query-builder/typeorm-query-builder.module';
import {TaskExplorerService} from './task-explorer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        TagModule,
        TaskGroupModule,
        TypeormQueryBuilderModule,
    ],
    controllers: [TaskController],
    providers: [
        TaskService,
        TaskExplorerService,
    ],
    exports: [TaskService],
})
export class TaskModule {}

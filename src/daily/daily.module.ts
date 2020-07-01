import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Daily} from './daily.entity';
import {DailyToTask} from './daily-to-task.entity';
import {DailyService} from './daily.service';
import {TaskGroupModule} from '../task-group/task-group.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Daily, DailyToTask]),
        TaskGroupModule,
    ],
    providers: [DailyService],
    exports: [DailyService],
})
export class DailyModule {}

import {Module} from '@nestjs/common';
import {TypeormQueryBuilderService} from './typeorm-query-builder.service';

@Module({
    providers: [TypeormQueryBuilderService],
    exports: [TypeormQueryBuilderService],
})
export class TypeormQueryBuilderModule {}

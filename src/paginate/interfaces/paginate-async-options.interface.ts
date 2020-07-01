import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {PaginateModuleOptionsInterface} from './paginate-module-options.interface';

export interface PaginateAsyncOptionsInterface
    extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useFactory?: (
        ...args: any[]
    ) => Promise<PaginateModuleOptionsInterface> | PaginateModuleOptionsInterface;
}

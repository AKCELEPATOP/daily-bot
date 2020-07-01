import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {MyStemModuleOptionsInterface} from './my-stem-module-options.interface';
import {MyStemOptionsFactoryInterface} from './my-stem-options-factory.interface';

export interface MyStemModuleAsyncOptionsInterface
    extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<MyStemOptionsFactoryInterface>;
    useClass?: Type<MyStemOptionsFactoryInterface>;
    useFactory?: (
        ...args: any[]
    ) => Promise<MyStemModuleOptionsInterface> | MyStemModuleOptionsInterface;
}

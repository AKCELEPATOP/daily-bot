import {MyStemModuleOptionsInterface} from './my-stem-module-options.interface';

export interface MyStemOptionsFactoryInterface {
    createMyStemModuleOptions():
        Promise<MyStemModuleOptionsInterface> |
        MyStemModuleOptionsInterface;
}

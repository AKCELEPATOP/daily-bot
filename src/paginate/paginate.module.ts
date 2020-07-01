import {DynamicModule, Module, Provider} from '@nestjs/common';
import {PaginateService} from './paginate.service';
import {PaginateModuleOptionsInterface} from './interfaces';
import {PAGINATE_MODULE_OPTIONS} from './constants';
import {PaginateAsyncOptionsInterface} from './interfaces/paginate-async-options.interface';

@Module({})
export class PaginateModule {
    static register(options: PaginateModuleOptionsInterface): DynamicModule {
        return {
            module: PaginateModule,
            global: options.isGlobal,
            providers: [
                {
                    provide: PAGINATE_MODULE_OPTIONS,
                    useValue: options,
                },
                PaginateService,
            ],
            exports: [PaginateService],
        };
    }

    static forRootAsync(
        options: PaginateAsyncOptionsInterface,
    ): DynamicModule {
        return {
            module: PaginateModule,
            imports: options.imports,
            global: true,
            providers: [
                this.createConfigAsyncProviders(options),
                PaginateService,
            ],
            exports: [
                PaginateService,
            ],
        };
    }

    private static createConfigAsyncProviders(
        options: PaginateAsyncOptionsInterface,
    ): Provider {
        if (options && options.useFactory) {
            return {
                provide: PAGINATE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        } else {
            return {
                provide: PAGINATE_MODULE_OPTIONS,
                useValue: {},
            };
        }
    }
}

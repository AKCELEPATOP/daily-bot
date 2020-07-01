import {DynamicModule, Module, Provider} from '@nestjs/common';
import {MyStemService} from './my-stem.service';
import {MyStemModuleAsyncOptionsInterface, MyStemModuleOptionsInterface} from './interfaces';
import {
    MY_STEM_MODULE_OPTIONS,
} from './constants';
import {MyStemOptionsFactoryInterface} from './interfaces/my-stem-options-factory.interface';
import {AnalysisService} from './analysis.service';

@Module({})
export class MyStemModule {
    static register(options: MyStemModuleOptionsInterface): DynamicModule {
        return {
            module: MyStemModule,
            global: options.isGlobal,
            providers: [
                {
                    provide: MY_STEM_MODULE_OPTIONS,
                    useValue: options,
                },
                MyStemService,
                AnalysisService,
            ],
            exports: [
                MyStemService,
                AnalysisService,
            ],
        };
    }

    static forRootAsync(
        options: MyStemModuleAsyncOptionsInterface,
    ): DynamicModule {
        return {
            module: MyStemModule,
            imports: options.imports,
            global: true,
            providers: [
                this.createConfigAsyncProviders(options),
                MyStemService,
                AnalysisService,
            ],
            exports: [
                MyStemService,
                AnalysisService,
            ],
        };
    }

    private static createConfigAsyncProviders(
        options: MyStemModuleAsyncOptionsInterface,
    ): Provider {
        if (options) {
            if (options.useFactory) {
                return {
                    provide: MY_STEM_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                };
            } else {
                return {
                    provide: MY_STEM_MODULE_OPTIONS,
                    useFactory: async (optionsFactory: MyStemOptionsFactoryInterface) =>
                        await optionsFactory.createMyStemModuleOptions(),
                    inject: [options.useExisting || options.useClass],
                };
            }
        } else {
            return {
                provide: MY_STEM_MODULE_OPTIONS,
                useValue: {},
            };
        }
    }
}

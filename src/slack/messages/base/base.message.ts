import {MessageInterface} from '../../types/message/message.interface';
import {I18nService} from 'nestjs-i18n';
import {
    I18nTranslateArgsType,
    I18nTranslateOptionsInterface
} from '../../types/message/i18n-translate-options.interface';

export abstract class BaseMessage implements MessageInterface {
    constructor(
        private readonly i18nService: I18nService,
        private readonly lang: string,
    ) {}

    public setParams(...args: any): this {
        return this;
    }

    protected __(path: string, args?: I18nTranslateArgsType): Promise<string | {} | []> {
        const options: I18nTranslateOptionsInterface = {};
        if (this.lang) {
            options.lang = this.lang;
        }
        if (args) {
            options.args = args;
        }

        return this.i18nService.translate(path, options);
    }

    abstract render(): Promise<any>;
}
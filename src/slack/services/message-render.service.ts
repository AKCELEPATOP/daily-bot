import {Injectable} from '@nestjs/common';
import {BaseMessage} from '../messages/base/base.message';
import {Type} from '@nestjs/common/interfaces/type.interface';
import { I18nService } from 'nestjs-i18n';
import {SetMessageParams} from '../types/message/set-message-params.type';

@Injectable()
export class MessageRenderService {
    constructor(
        protected readonly i18n: I18nService,
    ) {}

    public async getMessage<T extends BaseMessage>(
        type: Type<T>,
        lang?: string,
        ...params: SetMessageParams<T>
    ): Promise<BaseMessage> {
        // todo сделать анализ типов через ConstructorParameters и прикрутить к moduleRef
        const message = new type(this.i18n, lang);
        // @ts-ignore
        return message.setParams(...params);
    }
}

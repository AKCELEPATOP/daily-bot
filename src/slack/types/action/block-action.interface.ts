import { BaseSlackActionInterface } from './base/base-slack-action.interface';
import { BaseBlockActionInterface } from './base/base-block-action.interface';
import {MessageInterface} from './base/message.interface';
import {ActionContainerInterface} from './base/action-container.interface';

export interface BlockActionInterface extends BaseSlackActionInterface {
    actions: BaseBlockActionInterface[];
    message: MessageInterface;
    container: ActionContainerInterface;
}

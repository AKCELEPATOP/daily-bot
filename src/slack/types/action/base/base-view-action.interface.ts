import { BaseSlackActionInterface } from './base-slack-action.interface';

export interface BaseViewActionInterface extends BaseSlackActionInterface {
    view: {
        callback_id: string;
    };
    previous_view_id: string;
    root_view_id: string;
}

import { BaseViewActionInterface } from './base/base-view-action.interface';

export interface CreateTaskActionInterface extends BaseViewActionInterface {
    view: {
        callback_id: string;
        state: {
            values: {
                task: {
                    title: {
                        value: string;
                    },
                },
            },
        }
    };
}

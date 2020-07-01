import { MessageInterface } from '../types/message/message.interface';

export class CreateViewMessage implements MessageInterface {

    public render(): any {
        return this.getPattern();
    }

    public getPattern(): any {
        return {
            "type": "modal",
            "callback_id": "createTask",
            "title": {
                "type": "plain_text",
                "text": "Create task",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "divider"
                },
                {
                    "type": "input",
                    "block_id": "task",
                    "element": {
                        "type": "plain_text_input",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Enter task name"
                        },
                        "action_id": "title"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Name",
                        "emoji": true
                    }
                }
            ]
        };
    }
}

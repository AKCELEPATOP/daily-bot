import { MessageInterface } from '../types/message/message.interface';
import { Task } from '../../task/task.entity';
import { ActionTaskViewMessage } from './components/action-task-view.message';

export class ActiveTasksDialogCreatorMessage implements MessageInterface {
    constructor(private tasks: Task[]) { }

    public render() {
        return this.getPattern(this.renderTasks(this.tasks));
    }

    protected getPattern(blocks: any) {
        return {
            "type": "modal",
            "title": {
                "type": "plain_text",
                "text": "My App",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Close",
                "emoji": true
            },
            "blocks": blocks
        };
    }

    protected renderTasks(tasks: Task[]) {
        let taskBlocks = [];
        tasks.forEach(task => {
            taskBlocks.push(... new ActionTaskViewMessage(task).render());
        });
        return taskBlocks;
    }
}

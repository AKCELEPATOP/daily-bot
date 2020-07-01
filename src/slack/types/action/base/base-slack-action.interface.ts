import { ActionUserInterface } from './action-user.interface';
import { ActionTeamInterface } from './action-team.interface';

export interface BaseSlackActionInterface {
    type: 'view_submission' | 'block_actions';
    trigger_id: string;
    team: ActionTeamInterface;
    user: ActionUserInterface;
}

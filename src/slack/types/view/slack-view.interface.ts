export interface SlackViewInterface {
    id: string;
    team_id: string;
    type: 'modal';
    blocks: object; // todo
    callback_id: string;
    hash: string;
    clear_on_close: boolean;
    notify_on_close: boolean;
    previous_view_id: string;
    root_view_id: string;
}

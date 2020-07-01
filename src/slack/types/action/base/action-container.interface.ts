export interface ActionContainerInterface {
    type: 'message';
    message_ts: string;
    channel_id: string;
    is_ephemeral: boolean;
}

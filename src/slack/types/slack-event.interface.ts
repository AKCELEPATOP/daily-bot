export interface SlackEventInterface {
    user: string;
    client_msg_id: string;
    type: string;
    text: string;
    team: string;
    ts: string;
    channel: string;
    event_ts: string;
    channel_type: string;
}

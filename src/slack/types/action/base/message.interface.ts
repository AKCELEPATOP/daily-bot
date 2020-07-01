export interface MessageInterface {
    type: 'message';
    subtype: string;
    text: string;
    ts: string;
    username: string;
}

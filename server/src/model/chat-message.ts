import { Message } from './message';
import { User } from './user';

export class ChatMessage extends Message {
    constructor(from: User, content: string) {
        super(from, content);
    }
}
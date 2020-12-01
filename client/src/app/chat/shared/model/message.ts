import { User } from './user';
import { Action } from '../enums/action.enum';

export interface Message {

    from?: User;
    content?: any;
    action?: Action;
    timestamp?: string;
}

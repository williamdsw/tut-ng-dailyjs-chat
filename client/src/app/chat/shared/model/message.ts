import { User } from './user';
import { Action } from '../enums/action.enum';

export interface Message {

    // FIELDS

    from?: User;
    content?: any;
    action?: Action;
    timestamp?: string;
}

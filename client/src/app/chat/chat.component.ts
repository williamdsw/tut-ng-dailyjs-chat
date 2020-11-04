import { Component, OnInit, ViewChild, ElementRef, QueryList, AfterViewInit, ViewChildren, ɵConsole } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';

import * as moment from 'moment';

import { User } from './shared/model/user';
import { Message } from './shared/model/message';

import { Action } from './shared/enums/action.enum';
import { SocketEvent } from './shared/enums/socket-event.enum';
import { DialogUserType } from './shared/enums/dialog-user-type.enum';

import { SocketService } from './shared/services/socket.service';

import { DialogUserComponent } from './dialog-user/dialog-user.component';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  // FIELDS

  public messageMaxlength = 140;
  public currentAction: Action = Action.JOINED;
  public user: User;
  public messages: Message[] = [];
  public messageContent: string;
  private ioConnection: any;
  private dialogRef: MatDialogRef<DialogUserComponent> | null;
  private defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  @ViewChild(MatList, { read: ElementRef, static: true })
  public matList: ElementRef;

  @ViewChildren(MatListItem, { read: ElementRef })
  public matListItems: QueryList<MatListItem>;

  // CONSTRUCTOR

  constructor(
    private socketService: SocketService,
    private dialog: MatDialog
  ) { }

  // LIFECYCLE HOOKS

  ngOnInit(): void {
    this.initModel();

    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }

  ngAfterViewInit(): void {
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // HELPER FUNCTIONS

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (error) {}
  }

  private initModel(): void {
    const RANDOM_ID = this.getRandomNumber(1, 1000000, true);

    // custom color
    const R = this.getRandomNumber(0, 255, true);
    const G = this.getRandomNumber(0, 255, true);
    const B = this.getRandomNumber(0, 255, true);
    const A = this.getRandomNumber(0.75, 1, false).toFixed(1);

    this.user = {
      id: RANDOM_ID,
      color: `color: rgba(${R},${G},${B},${A})`,
    };

    console.log (this.user);
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      console.log (paramsDialog);
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT,
        color: this.user.color
      }
    });
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage ().subscribe(
      (message: Message) => {
        this.messages.push(message);
      }
    );

    this.socketService.onEvent(SocketEvent.CONNECT).subscribe(() => {
      console.log('connected');
    });

    this.socketService.onEvent(SocketEvent.DISCONNECT).subscribe(() => {
      console.log('disconnected');
    });
  }

  public sendMessage(message: string): void {
    if (!message) { return; }

    const currentTime = moment(new Date()).format('YYYY-mm-DD HH:MM');

    this.socketService.send({
      timestamp: currentTime,
      from: this.user,
      content: message,
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let localMessage: Message;

    const currentTime = moment(new Date()).format('YYYY-mm-DD HH:MM');

    console.log (params);

    if (action === Action.JOINED) {
      localMessage = {
        timestamp: currentTime,
        from: this.user,
        action
      };
    } else if (action === Action.RENAME) {
      localMessage = {
        timestamp: currentTime,
        action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername,
          color: params.color
        }
      };
    }

    this.socketService.send(localMessage);
  }

  public checkAction(action: Action, actionValue: string) {

    switch (action) {
      case Action.JOINED: {
        return actionValue === 'JOINED';
      }

      case Action.RENAME: {
        return actionValue === 'RENAME';
      }
    }
  }

  private getRandomNumber(min: number, max: number, toFloor: boolean): number {

    const RANDOM = (Math.random() * (max - min)) + min;

    if (toFloor) {
      return Math.floor(RANDOM);
    }

    return RANDOM;
  }

  public onKeydown(event: Event) {
    if (event instanceof KeyboardEvent) {
      if (event.key === 'Enter' || event.code === 'Enter') {
        this.sendMessage(this.messageContent);
      }
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';

@NgModule({
  declarations: [ChatComponent, DialogUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [DialogUserComponent]
})
export class ChatModule { }

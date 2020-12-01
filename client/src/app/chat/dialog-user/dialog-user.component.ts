import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {

  public usernameFormControl = new FormControl('', [Validators.required]);
  public previousUsername: string;
  private color: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any,
  ) {
    this.previousUsername = (params.username ? params.username : undefined);
    this.color = params.color;
    this.usernameFormControl.setValue(params.username);
  }

  ngOnInit(): void {}

  public onSave(): void {
    this.dialogRef.close({
      username: this.usernameFormControl.value,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername,
      color: this.color
    });
  }
}

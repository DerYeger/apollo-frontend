import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'apollo-update-available',
  templateUrl: './update-available.dialog.html',
  styleUrls: ['./update-available.dialog.scss'],
})
export class UpdateAvailableDialog {
  public constructor(private readonly dialogRef: MatDialogRef<UpdateAvailableDialog>) {
    dialogRef.disableClose = true;
  }

  public close(): void {
    this.dialogRef.close();
  }
}

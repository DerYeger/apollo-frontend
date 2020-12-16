import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { storeGraph } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'gramofo-save-graph',
  templateUrl: './save-graph.dialog.html',
  styleUrls: ['./save-graph.dialog.scss'],
})
export class SaveGraphDialog {
  public readonly graphName: FormControl;

  constructor(private readonly dialogRef: MatDialogRef<SaveGraphDialog>, @Inject(MAT_DIALOG_DATA) public readonly graph: FOLGraph, private readonly store: Store<State>) {
    this.graphName = new FormControl(graph.name, Validators.required);
  }

  saveGraph(): void {
    this.store.dispatch(storeGraph({ ...this.graph, name: this.graphName.value }));
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

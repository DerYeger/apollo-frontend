import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FOLGraph } from 'src/app/model/domain/fol.graph';

/**
 * Dialog that allows changing name and description of a graph.
 */
@Component({
  templateUrl: './save-graph.dialog.html',
  styleUrls: ['./save-graph.dialog.scss'],
})
export class SaveGraphDialog {
  public readonly graphName: FormControl;
  public readonly graphDescription: FormControl;

  public constructor(private readonly dialogRef: MatDialogRef<SaveGraphDialog>, @Inject(MAT_DIALOG_DATA) public readonly graph: FOLGraph) {
    this.graphName = new FormControl(graph.name, Validators.required);
    this.graphDescription = new FormControl(graph.description);
  }

  public updatedGraph(): FOLGraph | undefined {
    if (this.graphName.invalid) {
      return undefined;
    }
    return { ...this.graph, name: this.graphName.value, description: this.graphDescription.value, lastEdit: Date.now() };
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}

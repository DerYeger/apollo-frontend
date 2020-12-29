import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

@Component({
  templateUrl: './result-tree.dialog.html',
  styleUrls: ['./result-tree.dialog.scss'],
})
export class ResultTreeDialog {
  public readonly treeControl = new NestedTreeControl<ModelCheckerTrace>((trace) => trace.children);
  public readonly dataSource = new MatTreeNestedDataSource<ModelCheckerTrace>();

  constructor(public readonly dialogRef: MatDialogRef<ResultTreeDialog>, @Inject(MAT_DIALOG_DATA) public readonly root: ModelCheckerTrace) {
    this.dataSource.data = [root];
    this.treeControl.dataNodes = [root];
  }

  hasChild = (_: number, trace: ModelCheckerTrace) => !!trace.children && trace.children.length > 0;

  expandInvalid(): void {
    this.treeControl.collapseAll();
    this.expandInvalidTraces(this.root);
  }

  private expandInvalidTraces(trace: ModelCheckerTrace): boolean {
    if (trace.isModel) {
      return false;
    }
    this.treeControl.expand(trace);
    return trace.children.map((child) => this.expandInvalidTraces(child)).some(didExpand => didExpand);
  }
}

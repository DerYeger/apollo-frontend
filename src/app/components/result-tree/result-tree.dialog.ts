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

  showCauses(): void {
    this.treeControl.collapseAll();
    if (this.root.isModel) {
      this.expandValidTraces(this.root);
    } else {
      this.expandInvalidTraces(this.root);
    }
  }

  private expandValidTraces(trace: ModelCheckerTrace): void {
    if (trace.isModel !== trace.shouldBeModel) {
      return;
    }
    this.treeControl.expand(trace);
    trace.children.forEach((child) => this.expandValidTraces(child));
  }

  private expandInvalidTraces(trace: ModelCheckerTrace): void {
    if (trace.isModel === trace.shouldBeModel) {
      return;
    }
    this.treeControl.expand(trace);
    trace.children.forEach((child) => this.expandInvalidTraces(child));
  }
}

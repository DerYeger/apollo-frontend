import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';

interface TraceNode {
  trace: ModelCheckerTrace;
  children: TraceNode[];
  visible: boolean;
}

@Component({
  templateUrl: './result-tree.dialog.html',
  styleUrls: ['./result-tree.dialog.scss'],
})
export class ResultTreeDialog {
  public readonly treeControl = new NestedTreeControl<TraceNode>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<TraceNode>();

  public readonly rootNode: TraceNode;

  constructor(public readonly dialogRef: MatDialogRef<ResultTreeDialog>, @Inject(MAT_DIALOG_DATA) public readonly rootTrace: ModelCheckerTrace) {
    this.rootNode = traceToNode(rootTrace);
    const data = [this.rootNode];
    this.dataSource.data = data;
    this.treeControl.dataNodes = data;
    this.treeControl.expandAll();
  }

  public hasChild = (_: number, node: TraceNode) => !!node.children && node.children.length > 0;

  public updateFilter(filter: boolean): void {
    if (!filter) {
      clearFilter(this.rootNode);
    } else {
      filterCauses(this.rootNode, this.rootNode.trace.isModel);
    }
  }
}

function clearFilter(node: TraceNode): void {
  node.visible = true;
  node.children.forEach((child) => clearFilter(child));
}

function filterCauses(node: TraceNode, expected: boolean): void {
  // Check if trace behaved as required.
  const actual = node.trace.isModel === node.trace.shouldBeModel;
  // Check if filtering is for positive or negative causes
  if (actual === expected) {
    node.visible = true;
    node.children.forEach((child) => filterCauses(child, expected));
  } else {
    node.visible = false;
  }
}

function traceToNode(trace: ModelCheckerTrace): TraceNode {
  return {
    trace,
    children: trace.children.map((child) => traceToNode(child)),
    visible: true,
  };
}

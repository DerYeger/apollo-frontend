import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { CONSTANT_SYMBOL_EDITOR_CONFIGURATION, RELATION_SYMBOL_EDITOR_CONFIGURATION } from 'src/app/configurations/symbol-editor.configuration';
import { D3Node } from 'src/app/model/d3/d3.node';

/**
 * Component for editing and deleting nodes of a graph.
 */
@Component({
  selector: 'gramofo-node-form[node]',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss'],
})
export class NodeFormComponent {
  @Input() public node!: D3Node | null;

  @Output() public readonly nodeDeletionRequested = new EventEmitter<D3Node>();
  @Output() public readonly nodeUpdated = new EventEmitter();

  public readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  public readonly constantEditorConfig = CONSTANT_SYMBOL_EDITOR_CONFIGURATION;

  public constructor(private readonly log: NGXLogger) {}

  public requestNodeDeletion(): void {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      this.nodeDeletionRequested.emit(node);
    }
  }

  public onNodeUpdated(): void {
    this.nodeUpdated.emit();
  }

  public onNodeDeleted(deletedNode: D3Node): void {
    if (this.node !== null && this.node.id === deletedNode.id) {
      this.log.debug(`Removing Node ${this.node.id}, because it has been deleted.`);
      this.node = null;
    }
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import {
  CONSTANT_SYMBOL_EDITOR_CONFIGURATION,
  RELATION_SYMBOL_EDITOR_CONFIGURATION,
} from 'src/app/configurations/symbol-editor.configuration';
import { FOLNode } from 'src/app/model/d3/node';

@Component({
  selector: 'gramofo-node-form[node]',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss'],
})
export class NodeFormComponent {
  @Input() node!: FOLNode | null;

  @Output() readonly nodeDeletionRequested = new EventEmitter<FOLNode>();
  @Output() readonly nodeUpdated = new EventEmitter();

  readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  readonly constantEditorConfig = CONSTANT_SYMBOL_EDITOR_CONFIGURATION;

  constructor(private readonly log: NGXLogger) {}

  requestNodeDeletion(): void {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      this.nodeDeletionRequested.emit(node);
    }
  }

  onNodeUpdated(): void {
    this.nodeUpdated.emit();
  }

  onNodeDeleted(deletedNode: FOLNode): void {
    if (this.node !== null && this.node.id === deletedNode.id) {
      this.log.debug(`Removing Node ${this.node.id}, because it has been deleted.`);
      this.node = null;
    }
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject, Subscription } from 'rxjs';
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
export class NodeFormComponent implements OnDestroy, OnInit {
  @Input() node!: FOLNode | null;

  private nodeDeletionsSubscription$?: Subscription;
  @Input() nodeDeletions$?: Observable<FOLNode>;

  private readonly deletionRequestsSubject$ = new Subject<FOLNode>();
  @Output() readonly deletionRequests$ = this.deletionRequestsSubject$.asObservable();

  @Output() readonly nodeUpdated = new EventEmitter();

  readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  readonly constantEditorConfig = CONSTANT_SYMBOL_EDITOR_CONFIGURATION;

  constructor(private readonly log: NGXLogger) { }

  onNodeUpdated(): void {
    this.nodeUpdated.emit();
  }

  ngOnInit(): void {
    this.nodeDeletionsSubscription$ = this.nodeDeletions$?.subscribe((deletedNode) => {
      if (this.node !== null && this.node.id === deletedNode.id) {
        this.log.debug(`Removing Node ${this.node.id}, because it has been deleted.`);
        this.node = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.nodeDeletionsSubscription$?.unsubscribe();
  }

  onDelete(): void {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      this.deletionRequestsSubject$.next(node);
    }
  }
}

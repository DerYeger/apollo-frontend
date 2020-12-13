import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject, Subscription } from 'rxjs';
import { FOLNode } from 'src/app/model/d3/node';

@Component({
  selector: 'gramofo-node-form[node]',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss'],
})
export class NodeFormComponent implements OnChanges, OnDestroy, OnInit {
  @Input() node!: FOLNode | null;

  private nodeDeletionsSubscription$?: Subscription;
  @Input() nodeDeletions$?: Observable<FOLNode>;

  private readonly deletionRequestsSubject$ = new Subject<FOLNode>();
  @Output() readonly deletionRequests$ = this.deletionRequestsSubject$.asObservable();

  readonly form: FormGroup;

  constructor(private readonly log: NGXLogger, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      symbols: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.nodeDeletionsSubscription$ = this.nodeDeletions$?.subscribe((deletedNode) => {
      if (this.node !== null && this.node.id === deletedNode.id) {
        this.log.debug(`Removing Node ${this.node.id}, because it has been deleted.`);
        this.node = null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newNode = changes.node.currentValue;
    if (newNode !== null) {
      this.log.debug(`Loading Node ${newNode.id}`);
    }
  }

  ngOnDestroy(): void {
    this.nodeDeletionsSubscription$?.unsubscribe();
  }

  onSubmit(): void {
    if (this.node !== null) {
      const input = (this.form.get('symbols')?.value ?? '') as string;
      const symbols = input.split(',').map((s) => s.trim());
      this.log.debug(`Node ${this.node.id}: Setting symbols: ${symbols}`);
    }
  }

  onDelete(): void {
    if (this.node !== null) {
      const node = this.node;
      this.node = null;
      this.deletionRequestsSubject$.next(node);
    }
  }

  addRelation(relationAddedEvent: MatChipInputEvent): void {
    const relation = relationAddedEvent.value.trim();
    if (this.node !== null && relation.length > 1) {
      relationAddedEvent.input.value = '';
      this.node.relations.add(relation);
    }
  }

  removeRelation(relation: string): void {
    if (this.node !== null) {
      this.node.relations.delete(relation);
    }
  }

  addConstant(constantAddedEvent: MatChipInputEvent): void {
    const constant = constantAddedEvent.value.trim();
    if (this.node !== null && constant.length > 1) {
      constantAddedEvent.input.value = '';
      this.node.constants.add(constant);
    }
  }

  removeConstant(constant: string): void {
    if (this.node !== null) {
      this.node.constants.delete(constant);
    }
  }
}

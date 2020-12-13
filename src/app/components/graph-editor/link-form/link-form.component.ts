import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  FUNCTION_SYMBOL_EDITOR_CONFIGURATION,
  RELATION_SYMBOL_EDITOR_CONFIGURATION,
} from 'src/app/configurations/symbol-editor.configuration';
import { FOLLink } from 'src/app/model/d3/link';

@Component({
  selector: 'gramofo-link-form[link]',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent implements OnDestroy, OnInit {
  @Input() link!: FOLLink | null;

  private linkDeletionsSubscription$?: Subscription;
  @Input() linkDeletions$?: Observable<FOLLink>;

  private readonly deletionRequestsSubject$ = new Subject<FOLLink>();
  @Output() readonly deletionRequests$ = this.deletionRequestsSubject$.asObservable();

  @Output() readonly linkUpdated = new EventEmitter();

  readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  readonly functionEditorConfig = FUNCTION_SYMBOL_EDITOR_CONFIGURATION;

  constructor(private readonly log: NGXLogger) {}

  onLinkUpdated(): void {
    this.linkUpdated.emit();
  }

  ngOnInit(): void {
    this.linkDeletionsSubscription$ = this.linkDeletions$?.subscribe((deletedLink) => {
      if (this.link !== null && this.link.source.id === deletedLink.source.id && this.link.target.id === deletedLink.target.id) {
        this.log.debug(`Removing Link ${this.link.source.id}-${this.link.target.id}, because it has been deleted.`);
        this.link = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.linkDeletionsSubscription$?.unsubscribe();
  }

  onDelete(): void {
    if (this.link !== null) {
      const link = this.link;
      this.link = null;
      this.deletionRequestsSubject$.next(link);
    }
  }
}

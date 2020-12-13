import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FUNCTION_SYMBOL_EDITOR_CONFIGURATION, RELATION_SYMBOL_EDITOR_CONFIGURATION } from 'src/app/configurations/symbol-editor.configuration';
import { FOLLink } from 'src/app/model/d3/link';

@Component({
  selector: 'gramofo-link-form[link]',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent {
  @Input() link!: FOLLink | null;

  @Output() readonly linkDeletionRequested = new EventEmitter<FOLLink>();
  @Output() readonly linkUpdated = new EventEmitter();

  readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  readonly functionEditorConfig = FUNCTION_SYMBOL_EDITOR_CONFIGURATION;

  constructor(private readonly log: NGXLogger) {}

  requestLinkDeletion(): void {
    if (this.link !== null) {
      const link = this.link;
      this.link = null;
      this.linkDeletionRequested.emit(link);
    }
  }

  onLinkUpdated(): void {
    this.linkUpdated.emit();
  }

  onLinkDeleted(deletedLink: FOLLink): void {
    if (this.link !== null && this.link.source.id === deletedLink.source.id && this.link.target.id === deletedLink.target.id) {
      this.log.debug(`Removing Link ${this.link.source.id}-${this.link.target.id}, because it has been deleted.`);
      this.link = null;
    }
  }
}

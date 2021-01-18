import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FUNCTION_SYMBOL_EDITOR_CONFIGURATION, RELATION_SYMBOL_EDITOR_CONFIGURATION } from 'src/app/configurations/symbol-editor.configuration';
import { D3Link } from 'src/app/model/d3/d3.link';

/**
 * Component for editing and deleting links (edges) of a graph.
 */
@Component({
  selector: 'gramofo-link-form[link]',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent {
  @Input() public link!: D3Link | null;

  @Output() public readonly linkDeletionRequested = new EventEmitter<D3Link>();
  @Output() public readonly linkUpdated = new EventEmitter();

  public readonly relationEditorConfig = RELATION_SYMBOL_EDITOR_CONFIGURATION;
  public readonly functionEditorConfig = FUNCTION_SYMBOL_EDITOR_CONFIGURATION;

  public constructor(private readonly log: NGXLogger) {}

  public requestLinkDeletion(): void {
    if (this.link !== null) {
      const link = this.link;
      this.link = null;
      this.linkDeletionRequested.emit(link);
    }
  }

  public onLinkUpdated(): void {
    this.linkUpdated.emit();
  }

  public onLinkDeleted(deletedLink: D3Link): void {
    if (this.link !== null && this.link.source.id === deletedLink.source.id && this.link.target.id === deletedLink.target.id) {
      this.log.debug(`Removing Link ${this.link.source.id}-${this.link.target.id}, because it has been deleted.`);
      this.link = null;
    }
  }
}

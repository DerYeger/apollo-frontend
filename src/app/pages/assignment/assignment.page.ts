import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Assignment } from 'src/app/model/api/assignment';
import D3Graph from 'src/app/model/d3/d3.graph';
import { State } from 'src/app/store/state';

@Component({
  selector: 'apollo-assignment',
  templateUrl: './assignment.page.html',
  styleUrls: ['./assignment.page.scss'],
})
export class AssignmentPage {
  public readonly assignment: Observable<Assignment> = this.store.select('assignments').pipe(map((assignments) => assignments[this.slug]));

  public readonly firstGraph = of(new D3Graph());
  public readonly secondGraph = of(new D3Graph());

  private readonly slug = this.route.snapshot.params.slug;

  public constructor(private readonly route: ActivatedRoute, private readonly store: Store<State>) {}
}

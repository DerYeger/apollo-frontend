import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Assignment } from 'src/app/model/api/assignment';
import { BackendService } from 'src/app/services/backend.service';
import { State } from 'src/app/store/state';

@Component({
  selector: 'apollo-assignments',
  templateUrl: './assignments.page.html',
  styleUrls: ['./assignments.page.scss'],
})
export class AssignmentsPage implements OnInit {
  public readonly assignments: Observable<Assignment[]> = this.store.select('assignments').pipe(map((assignments) => Object.values(assignments)));

  public constructor(
    private readonly backendService: BackendService,
    private readonly store: Store<State>,
  ) {}

  public ngOnInit(): void {
    this.backendService.fetchAssignments();
  }
}

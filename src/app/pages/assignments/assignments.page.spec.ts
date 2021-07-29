import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { AssignmentCardComponent } from 'src/app/components/assignment-card/assignment-card.component';
import { MaterialModule } from 'src/app/material.module';
import { AssignmentsPage } from 'src/app/pages/assignments/assignments.page';
import { reducers } from 'src/app/store/reducers';

describe('AssignmentsPage', () => {
  let component: AssignmentsPage;
  let fixture: ComponentFixture<AssignmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentsPage, AssignmentCardComponent],
      imports: [HttpClientTestingModule, MaterialModule, RouterTestingModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

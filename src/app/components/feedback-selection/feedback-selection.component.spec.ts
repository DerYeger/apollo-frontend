import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { FeedbackSelectionComponent } from 'src/app/components/feedback-selection/feedback-selection.component';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

describe('FeedbackSelectionComponent', () => {
  let component: FeedbackSelectionComponent;
  let fixture: ComponentFixture<FeedbackSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackSelectionComponent],
      imports: [MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

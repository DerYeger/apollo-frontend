import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultTreeDialog } from './result-tree.dialog';

describe('ResultTreeComponent', () => {
  let component: ResultTreeDialog;
  let fixture: ComponentFixture<ResultTreeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultTreeDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTreeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

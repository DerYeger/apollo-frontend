import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCheckerPage } from './model-checker.page';

describe('ModelCheckerPage', () => {
  let component: ModelCheckerPage;
  let fixture: ComponentFixture<ModelCheckerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelCheckerPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

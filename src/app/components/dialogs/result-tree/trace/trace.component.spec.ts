import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TraceComponent } from './trace.component';

describe('TraceComponent', () => {
  let component: TraceComponent;
  let fixture: ComponentFixture<TraceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraceComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceComponent);
    component = fixture.componentInstance;
    component.trace = {
      formula: '',
      description: {
        key: '',
      },
      isModel: false,
      shouldBeModel: false,
      children: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

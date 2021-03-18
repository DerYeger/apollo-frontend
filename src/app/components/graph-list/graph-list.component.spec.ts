import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { GraphListComponent } from 'src/app/components/graph-list/graph-list.component';
import { MaterialModule } from 'src/app/material.module';

describe('GraphListComponent', () => {
  let component: GraphListComponent;
  let fixture: ComponentFixture<GraphListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphListComponent],
      imports: [MaterialModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

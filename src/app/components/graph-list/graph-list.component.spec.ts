import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';

import { GraphListComponent } from './graph-list.component';

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

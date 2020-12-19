import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

import { GraphImportComponent } from './graph-import.component';

describe('GraphImportComponent', () => {
  let component: GraphImportComponent;
  let fixture: ComponentFixture<GraphImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphImportComponent],
      imports: [MaterialModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), LoggerTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

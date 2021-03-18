import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { GraphImportComponent } from 'src/app/components/graph-import/graph-import.component';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

describe('GraphImportComponent', () => {
  let component: GraphImportComponent;
  let fixture: ComponentFixture<GraphImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphImportComponent],
      imports: [FormsModule, LoggerTestingModule, MaterialModule, ReactiveFormsModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
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

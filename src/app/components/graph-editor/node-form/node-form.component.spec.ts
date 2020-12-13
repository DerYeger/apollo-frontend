import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MaterialModule } from 'src/app/material.module';

import { NodeFormComponent } from './node-form.component';

describe('NodeFormComponent', () => {
  let component: NodeFormComponent;
  let fixture: ComponentFixture<NodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeFormComponent],
      imports: [LoggerTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

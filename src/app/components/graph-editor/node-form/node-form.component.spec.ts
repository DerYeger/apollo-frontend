import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { NodeFormComponent } from 'src/app/components/graph-editor/node-form/node-form.component';
import { MaterialModule } from 'src/app/material.module';

describe('NodeFormComponent', () => {
  let component: NodeFormComponent;
  let fixture: ComponentFixture<NodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeFormComponent],
      imports: [FormsModule, LoggerTestingModule, MaterialModule, ReactiveFormsModule, TranslateModule.forRoot()],
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

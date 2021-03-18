import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { LinkFormComponent } from 'src/app/components/graph-editor/link-form/link-form.component';
import { MaterialModule } from 'src/app/material.module';

describe('LinkFormComponent', () => {
  let component: LinkFormComponent;
  let fixture: ComponentFixture<LinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkFormComponent],
      imports: [LoggerTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

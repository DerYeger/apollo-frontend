import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UpdateAvailableDialog } from 'src/app/dialogs/update-available/update-available.dialog';

describe('UpdateAvailableDialog', () => {
  let component: UpdateAvailableDialog;
  let fixture: ComponentFixture<UpdateAvailableDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAvailableDialog],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAvailableDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

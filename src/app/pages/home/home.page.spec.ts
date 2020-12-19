import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { GraphImportComponent } from 'src/app/components/graph-import/graph-import.component';
import { GraphListComponent } from 'src/app/components/graph-list/graph-list.component';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/reducers';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage, GraphListComponent, GraphImportComponent],
      imports: [MaterialModule, StoreModule.forRoot(reducers, undefined), AppRoutingModule, TranslateModule.forRoot(), LoggerTestingModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

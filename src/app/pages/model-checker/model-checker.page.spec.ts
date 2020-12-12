import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphEditorComponent } from 'src/app/components/graph-editor/graph-editor.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';

import { ModelCheckerPage } from './model-checker.page';

describe('ModelCheckerPage', () => {
  let component: ModelCheckerPage;
  let fixture: ComponentFixture<ModelCheckerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModelCheckerPage,
        GraphEditorComponent,
        GraphComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

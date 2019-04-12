import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileInterpreterComponent } from './tile-interpreter.component';

describe('TileInterpreterComponent', () => {
  let component: TileInterpreterComponent;
  let fixture: ComponentFixture<TileInterpreterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileInterpreterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileInterpreterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

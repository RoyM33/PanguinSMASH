import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileInterpreterComponent } from './tile-interpreter.component';
import { MapService } from '../services/map.service';
import { Tile } from '../helpers/Tile';
import { PenguinControllerService } from '../services/penguin-controller.service';
import { Subject } from 'rxjs';

describe('TileInterpreterComponent', () => {
  let component: TileInterpreterComponent;
  let fixture: ComponentFixture<TileInterpreterComponent>;

  beforeEach(async(() => {
    const MockMapService = jasmine.createSpyObj('MapService', ['Columns', 'Rows', 'GetTileByIndex']);
    MockMapService.GetTileByIndex = (col: number, row: number) => {
      return new Tile(MockMapService, col, row);
    };
    const MockPenguinService = jasmine.createSpyObj<PenguinControllerService>(["PenguinSubject", "SpawnPenguin"]);
    MockPenguinService.PenguinSubject = new Subject();
    MockPenguinService.SpawnPenguin.and.callFake(() => {

    });
    TestBed.configureTestingModule({
      declarations: [TileInterpreterComponent],
      providers: [{ provide: MapService, useValue: MockMapService },
      { provide: PenguinControllerService, useValue: MockPenguinService }]
    }).compileComponents();
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

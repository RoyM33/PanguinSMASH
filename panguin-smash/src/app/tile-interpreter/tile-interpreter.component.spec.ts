import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileInterpreterComponent } from './tile-interpreter.component';
import { MapService } from '../services/map.service';
import { Tile } from '../helpers/Tile';
import { PenguinControllerService } from '../services/penguin-controller.service';
import { Subject, ReplaySubject } from 'rxjs';
import { EventHandler } from '../helpers/EventHandler';
import { SubjectContainerService } from '../services/subject-container.service';
import { ILocation } from '../interfaces/ILocation';
import { CreatureType } from '../helpers/CreatureType';

describe('TileInterpreterComponent', () => {
  let component: TileInterpreterComponent;
  let fixture: ComponentFixture<TileInterpreterComponent>;
  let subjectContainerService: jasmine.SpyObj<SubjectContainerService>;
  let mockMapService: jasmine.SpyObj<MapService>;

  beforeEach(async(() => {
    mockMapService = jasmine.createSpyObj<MapService>(['Columns', 'Rows', 'GetTileByIndex', 'OnLoadComplete']);
    mockMapService.GetTileByIndex.and.callFake((col: number, row: number) => {
      return new Tile(mockMapService, col, row);
    });
    mockMapService.OnLoadComplete = new EventHandler();
    subjectContainerService = jasmine.createSpyObj<SubjectContainerService>(["PenguinSubject"])
    subjectContainerService.PenguinSubject = new ReplaySubject<ILocation>();
    subjectContainerService.SnobeeSubject = new ReplaySubject<ILocation[]>();

    TestBed.configureTestingModule({
      declarations: [TileInterpreterComponent],
      providers: [{ provide: MapService, useValue: mockMapService },
      { provide: SubjectContainerService, useValue: subjectContainerService }]
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

  it('should show Penguin Correctly', () => {
    component.tile = new Tile(mockMapService, 1, 1);
    subjectContainerService.PenguinSubject.next({ Column: 1, Row: 1 });
    expect(component.CreatureStyle == CreatureType.Panguin);
  });

  it('should show snoBee Correctly', () => {
    component.tile = new Tile(mockMapService, 1, 1);
    subjectContainerService.SnobeeSubject.next([{ Column: 1, Row: 1 }]);
    expect(component.CreatureStyle == CreatureType.SnoBee);
  });
});

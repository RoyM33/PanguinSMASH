import { TestBed, async } from '@angular/core/testing';

import { PenguinControllerService } from './penguin-controller.service';
import { BlockAIService } from './block-a-i.service';
import { MapService } from './map.service';
import { Tile } from '../helpers/Tile';

describe('PenguinControllerService', () => {
  let service: PenguinControllerService;
  let MockMapService: jasmine.SpyObj<MapService>;
  beforeEach(async(() => {
    MockMapService = jasmine.createSpyObj<MapService>(['Columns', 'Rows', 'GenerateNewMap', 'LookAhead']);
    MockMapService.LookAhead.and.returnValue(new Tile(MockMapService, 1, 1));
    const MockBlockAIService = jasmine.createSpyObj('BlockAIService', ['CheckBlock']);
    TestBed.configureTestingModule({
      providers: [
        { provide: MockMapService, useValue: MockMapService },
        { provide: BlockAIService, useValue: MockBlockAIService }]
    });

    service = new PenguinControllerService(MockMapService, MockBlockAIService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Move Up', () => {
    it('should move up', () => {
      let originalRow = service.Location.Row;
      service.MoveUp();
      expect(service.Location.Row).toEqual(originalRow - 1);
    });
  });
});

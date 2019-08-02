import { TestBed, async } from '@angular/core/testing';

import { PenguinControllerService } from './penguin-controller.service';
import { BlockAIService } from './block-a-i.service';
import { MapService } from './map.service';
import { Tile } from '../helpers/Tile';
import { TileType } from '../helpers/TileType';
import { AssertNotNull } from '@angular/compiler';
import { SubjectContainerService } from './subject-container.service';
import { Subject, ReplaySubject } from 'rxjs';
import { ILocation } from '../interfaces/ILocation';

describe('PenguinControllerService', () => {
  let service: PenguinControllerService;
  let MockMapService: jasmine.SpyObj<MapService>;
  let MockBlockAIService: jasmine.SpyObj<BlockAIService>;
  let MockSubjectContainerService: jasmine.SpyObj<SubjectContainerService>;

  beforeEach(async(() => {
    MockMapService = jasmine.createSpyObj<MapService>(['Columns', 'Rows', 'GenerateNewMap', 'LookAhead', 'GetTileByIndex', 'LookInEveryDirection']);
    MockMapService.LookAhead.and.returnValue(new Tile(MockMapService, 1, 1));
    MockMapService.GetTileByIndex.and.callFake((i, x) => {
      var tile = new Tile(MockMapService, i, x);
      tile.TileType = TileType.Floor;
      return tile;
    });
    MockMapService.LookInEveryDirection.and.callThrough();
    (<any>MockMapService).rowLength = 15;
    (<any>MockMapService).columnLength = 15;
    MockBlockAIService = jasmine.createSpyObj('BlockAIService', ['PenguinInteraction']);

    MockSubjectContainerService = jasmine.createSpyObj<SubjectContainerService>(["PenguinSubject"])
    MockSubjectContainerService.PenguinSubject = new ReplaySubject<ILocation>();

    TestBed.configureTestingModule({
      providers: [
        { provide: MapService, useValue: MockMapService },
        { provide: BlockAIService, useValue: MockBlockAIService }]
    });

    service = new PenguinControllerService(MockMapService, MockBlockAIService, MockSubjectContainerService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Interact Up', () => {
    it('should move up', () => {
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractUp();
      expect(service.Location.Row).toEqual(startingRow - 1);
    });
    it('should not move up if the next block is block', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractUp();
      expect(service.Location.Row).toEqual(startingRow);
    });
    it('should not move up if the next block is diamond', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.DiamondBlock);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractUp();
      expect(service.Location.Row).toEqual(startingRow);
    });

    it('should not move up if at the top', () => {
      MockMapService.LookAhead.and.throwError("Shouldn't have been called");
      let startingRow = 0;
      service.Location = { Column: 0, Row: startingRow };
      service.InteractUp();
      expect(service.Location.Row).toEqual(startingRow);
    });

    it('should check next block if not able to move', (done) => {
      MockBlockAIService.PenguinInteraction.and.callFake(() => {
        done();
      });
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);

      let startingRow = 6;
      service.Location = { Column: 0, Row: startingRow };
      service.InteractUp();
      expect(service.Location.Row).toEqual(startingRow);
    });
  });

  describe('Interact Down', () => {
    it('should move down', () => {
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractDown();
      expect(service.Location.Row).toEqual(startingRow + 1);
    });
    it('should not move down if the next block is block', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractDown();
      expect(service.Location.Row).toEqual(startingRow);
    });
    it('should not move down if the next block is diamond', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.DiamondBlock);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingRow = 7
      service.Location = { Column: 0, Row: startingRow };
      service.InteractDown();
      expect(service.Location.Row).toEqual(startingRow);
    });
    it('should not move down if at the Edge', () => {
      MockMapService.LookAhead.and.throwError("Shouldn't have been called");
      let startingRow = MockMapService.rowLength;
      service.Location = { Column: 0, Row: startingRow };
      service.InteractDown();
      expect(service.Location.Row).toEqual(startingRow);
    });
    it('should check next block if not able to move', (done) => {
      MockBlockAIService.PenguinInteraction.and.callFake(() => {
        done();
      });
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);

      let startingRow = 6;
      service.Location = { Column: 0, Row: startingRow };
      service.InteractDown();
      expect(service.Location.Row).toEqual(startingRow);
    });
  });

  describe('Interact Left', () => {
    it('should move Left', () => {
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractLeft();
      expect(service.Location.Column).toEqual(startingColumn - 1);
    });
    it('should not move Left if the next block is block', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractLeft();
      expect(service.Location.Column).toEqual(startingColumn);
    });
    it('should not move Left if the next block is diamond', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.DiamondBlock);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractLeft();
      expect(service.Location.Column).toEqual(startingColumn);
    });
    it('should not move Left if at the Edge', () => {
      MockMapService.LookAhead.and.throwError("Shouldn't have been called");
      let startingColumn = 0;
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractLeft();
      expect(service.Location.Column).toEqual(startingColumn);
    });

    it('should check next block if not able to move', (done) => {
      MockBlockAIService.PenguinInteraction.and.callFake(() => {
        done();
      });
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);

      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractLeft();

      expect(service.Location.Column).toEqual(startingColumn);
    });
  });

  describe('Interact Right', () => {
    it('should move Right', () => {
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractRight();
      expect(service.Location.Column).toEqual(startingColumn + 1);
    });
    it('should not move Right if the next block is block', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractRight();
      expect(service.Location.Column).toEqual(startingColumn);
    });
    it('should not move Right if the next block is diamond', () => {
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.DiamondBlock);
      MockMapService.LookAhead.and.returnValue(tile);
      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractRight();
      expect(service.Location.Column).toEqual(startingColumn);
    });
    it('should not move Right if at the Edge', () => {
      MockMapService.LookAhead.and.throwError("Shouldn't have been called");
      let startingColumn = MockMapService.columnLength;
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractRight();
      expect(service.Location.Column).toEqual(startingColumn);
    });
    it('should check next block if not able to move', (done) => {
      MockBlockAIService.PenguinInteraction.and.callFake(() => {
        done();
      });
      var tile = new Tile(MockMapService, 1, 1);
      spyOnProperty(tile, "TileType").and.returnValue(TileType.Block);
      MockMapService.LookAhead.and.returnValue(tile);

      let startingColumn = 7
      service.Location = { Column: startingColumn, Row: 0 };
      service.InteractRight();

      expect(service.Location.Column).toEqual(startingColumn);
    });
  });

  describe("Is Here", () => {
    it('should return true when the panguan is here', () => {
      const column = 14;
      const row = 12;
      service.Location = { Column: column, Row: row };
      expect(service.IsHere(column, row)).toBeTruthy();
    });
    it('should return false when the panguan is not here', () => {
      const column = 14;
      const row = 12;
      service.Location = { Column: column, Row: row };
      expect(service.IsHere(10, 8)).toBeFalsy();
    });
  });

  describe("Spawns Correctly", () => {
    it('should Only Spawn Penguin on FloorTiles', () => {
      const mapService = new MapService();
      mapService.GenerateNewMap(3, 3);
      let tiles: Tile[] = mapService.Tiles;
      tiles.forEach(tile => tile.TileType == TileType.Floor);
      tiles[0].TileType = TileType.Floor;

      var service = new PenguinControllerService(mapService, MockBlockAIService, MockSubjectContainerService);
      service.SpawnPenguin(1, 1);
      var spawnedTile = mapService.GetTileByIndex(service.Location.Column, service.Location.Row);
      expect(spawnedTile.TileType).toEqual(TileType.Floor);
    });
  });
});

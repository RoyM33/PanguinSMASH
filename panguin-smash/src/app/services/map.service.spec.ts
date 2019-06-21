import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import { Tile } from '../helpers/Tile';
import { TileType } from '../helpers/TileType';
import { Direction } from '../helpers/Directions';
import { ExpectedConditions } from 'protractor';

describe('MapService', () => {

  it('should be created', () => {
    const service: MapService = TestBed.get(MapService);
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('Generate new Map', () => {
    it('should populate all the tiles', () => {
      var rowLength = 7;
      var columnLength = 6;

      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);
      expect((<any>mapService)._tiles.length).toEqual(rowLength * columnLength);
    });
    it('should generate only 3 diamond tiles', () => {

      const mapService = new MapService();
      mapService.GenerateNewMap(23, 18);
      let tiles: Tile[] = (<any>mapService)._tiles;
      var diamondTiles = tiles.filter(item => item.TileType == TileType.DiamondBlock);
      expect(diamondTiles.length).toEqual(3);
    });
    it('should not generate diamond tiles on the edge', () => {
      var rowLength = 2;
      var columnLength = 2;

      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);
      let tiles: Tile[] = (<any>mapService)._tiles;
      var diamondTiles = tiles.filter(item => item.TileType == TileType.DiamondBlock);
      expect(diamondTiles.length).toEqual(0);
    });
    it('should generate diamonds if less then 3 available', () => {
      var rowLength = 3;
      var columnLength = 3;

      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      var diamondTiles = tiles.filter(item => item.TileType == TileType.DiamondBlock);
      expect(diamondTiles.length).toEqual(1);
    });
    it('should not generate diamonds next to each other', () => {
      var rowLength = 4;
      var columnLength = 4;

      for (var i = 0; i < 20; i++) {
        const mapService = new MapService();
        mapService.GenerateNewMap(columnLength, rowLength);
        let tiles: Tile[] = (<any>mapService)._tiles;
        var diamondTiles = tiles.filter(item => item.TileType == TileType.DiamondBlock);
        //4 by 4 grid allows 4 available spots meaning only two valid that are not touching.
        expect(diamondTiles.length).toEqual(2);
      }
    });
  });

  describe("GetTileByIndex", () => {
    it("Should get the correct Tile", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      let randomTileIndex;
      let tile;

      for (let count = 0; count < 200; count++) {
        randomTileIndex = Math.floor(Math.random() * rowLength * columnLength);
        tile = tiles[randomTileIndex];
        expect(mapService.GetTileByIndex(tile.columnIndex, tile.rowIndex)).toEqual(tile);
      }
    });

    it("Should return null when looking ahead outside of the bounds", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      expect(mapService.GetTileByIndex(1, -1)).toBeFalsy();
      expect(mapService.GetTileByIndex(-1, 1)).toBeFalsy();
      expect(mapService.GetTileByIndex(columnLength + 1, 1)).toBeFalsy();
      expect(mapService.GetTileByIndex(1, rowLength + 1)).toBeFalsy();
    });
  });

  describe("LookAhead", () => {
    it("Should get the correct Left", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      let tile = tiles[18];

      let lookedAheadTile = mapService.LookAheadByTile(tile, Direction.left);
      expect(lookedAheadTile.columnIndex).toEqual(tile.columnIndex - 1);
      expect(lookedAheadTile.rowIndex).toEqual(tile.rowIndex);
    });
    it("Should get the correct Right", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      let tile = tiles[18];

      let lookedAheadTile = mapService.LookAheadByTile(tile, Direction.right);
      expect(lookedAheadTile.columnIndex).toEqual(tile.columnIndex + 1);
      expect(lookedAheadTile.rowIndex).toEqual(tile.rowIndex);
    });
    it("Should get the correct Top", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      let tile = tiles[18];

      let lookedAheadTile = mapService.LookAheadByTile(tile, Direction.up);
      expect(lookedAheadTile.rowIndex).toEqual(tile.rowIndex - 1);
      expect(lookedAheadTile.columnIndex).toEqual(tile.columnIndex);
    });
    it("Should get the correct Bottom", () => {
      let rowLength = 14;
      let columnLength = 8;
      const mapService = new MapService();
      mapService.GenerateNewMap(columnLength, rowLength);

      let tiles: Tile[] = (<any>mapService)._tiles;
      let tile = tiles[18];

      let lookedAheadTile = mapService.LookAheadByTile(tile, Direction.down);
      expect(lookedAheadTile.rowIndex).toEqual(tile.rowIndex + 1);
      expect(lookedAheadTile.columnIndex).toEqual(tile.columnIndex);
    });
  });

  describe('LookInEveryDirection', () => {
    it('should get the corrent neighbors', () => {
      const mapService = new MapService();
      mapService.GenerateNewMap(3, 3);

      let tile = mapService.GetTileByIndex(1, 1)

      var neighborTiles = mapService.LookInEveryDirection(tile);
      expect(neighborTiles.filter(nT => nT.rowIndex == 1 && nT.columnIndex == 2).length).toEqual(1);
      expect(neighborTiles.filter(nT => nT.rowIndex == 1 && nT.columnIndex == 0).length).toEqual(1);
      expect(neighborTiles.filter(nT => nT.rowIndex == 0 && nT.columnIndex == 1).length).toEqual(1);
      expect(neighborTiles.filter(nT => nT.rowIndex == 2 && nT.columnIndex == 1).length).toEqual(1);
    });
  });
});

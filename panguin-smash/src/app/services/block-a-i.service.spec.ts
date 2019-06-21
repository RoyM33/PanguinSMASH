import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BlockAIService } from './block-a-i.service';
import { MapService } from './map.service';
import { Tile } from '../helpers/Tile';
import { TileType } from '../helpers/TileType';
import { Direction } from '../helpers/Directions';
import { TileState } from '../helpers/TileState';
import { Mock } from 'protractor/built/driverProviders';

describe('BlockAIService', () => {
  let MockMapService: MapService;
  let AiService: BlockAIService;
  beforeEach(() => {
    MockMapService = new MapService();
    MockMapService.GenerateNewMap(10, 10);
    TestBed.configureTestingModule({
      providers: [{ provide: MapService, useValue: MockMapService }]
    });
    AiService = TestBed.get(BlockAIService);
  });

  it('should be created', () => {
    expect(AiService).toBeTruthy();
  });

  describe('PenguinInteraction', () => {

    it('should destroy blocks when next block is not floor', () => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      AiService.PenguinInteraction(0, 0, Direction.right);
      console.log(MockMapService.GetTileByIndex(1, 0))
      expect(MockMapService.GetTileByIndex(1, 0).TileType).toEqual(TileType.Floor);
    });

    it('should move blocks when next block is floor', () => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      tiles[2].TileType = TileType.Floor;
      AiService.PenguinInteraction(0, 0, Direction.right);
      expect(MockMapService.GetTileByIndex(1, 0).TileType).toEqual(TileType.Floor);
      expect(MockMapService.GetTileByIndex(2, 0).TileType).toEqual(TileType.Block);
    });

    it('should move blocks until runs into another block', fakeAsync(() => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      tiles[2].TileType = TileType.Floor;
      tiles[3].TileType = TileType.Floor;
      AiService.PenguinInteraction(0, 0, Direction.right);
      expect(MockMapService.GetTileByIndex(1, 0).TileType).toEqual(TileType.Floor);
      tick(121);
      expect(MockMapService.GetTileByIndex(2, 0).TileType).toEqual(TileType.Floor);
      tick(121);
      expect(MockMapService.GetTileByIndex(3, 0).TileType).toEqual(TileType.Block);
    }));

    it('should not destroy diamond blocks if next block is not floor', () => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      tiles[1].TileType = TileType.DiamondBlock;
      AiService.PenguinInteraction(0, 0, Direction.right);
      expect(MockMapService.GetTileByIndex(1, 0).TileType).toEqual(TileType.DiamondBlock);
    });

    it('should destroy blocks if edge of map', () => {
      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      AiService.PenguinInteraction(8, 0, Direction.right);
      expect(MockMapService.GetTileByIndex(9, 0).TileType).toEqual(TileType.Floor);
    });

    it('should check state of initial block', fakeAsync(() => {
      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      tiles[2].TileType = TileType.Floor;
      tiles[3].TileType = TileType.Floor;
      MockMapService.GetTileByIndex(1, 0).State = TileState.Blinking;
      AiService.PenguinInteraction(0, 0, Direction.right);
      tick(300);
      expect(MockMapService.GetTileByIndex(1, 0).State).toEqual(TileState.None);
    }));

    it('should check state of ending block', () => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      tiles[2].TileType = TileType.Floor;
      tiles[3].TileType = TileType.Floor;

      tiles[4].TileType = TileType.DiamondBlock;
      tiles[1].TileType = TileType.DiamondBlock;

      jasmine.clock().install();
      AiService.PenguinInteraction(0, 0, Direction.right);
      jasmine.clock().tick(300);
      jasmine.clock().uninstall();
      expect(MockMapService.GetTileByIndex(3, 0).State).toEqual(TileState.Blinking);
    });

    it('should check state of neighbor blocks', () => {

      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      //the block to move
      MockMapService.GetTileByIndex(1, 1).TileType = TileType.DiamondBlock;
      //the row of floor tiles
      MockMapService.GetTileByIndex(1, 2).TileType = TileType.Floor;
      MockMapService.GetTileByIndex(1, 3).TileType = TileType.Floor;
      MockMapService.GetTileByIndex(1, 4).TileType = TileType.Floor;
      MockMapService.GetTileByIndex(1, 5).TileType = TileType.Floor;
      //the blocks around the last floor location
      MockMapService.GetTileByIndex(0, 5).TileType = TileType.DiamondBlock;
      MockMapService.GetTileByIndex(2, 5).TileType = TileType.DiamondBlock;
      MockMapService.GetTileByIndex(1, 6).TileType = TileType.DiamondBlock;

      jasmine.clock().install();
      AiService.PenguinInteraction(1, 0, Direction.down);
      jasmine.clock().tick(1800);
      jasmine.clock().uninstall();
      expect(MockMapService.GetTileByIndex(0, 5).State).toEqual(TileState.Blinking);
      expect(MockMapService.GetTileByIndex(2, 5).State).toEqual(TileState.Blinking);
      expect(MockMapService.GetTileByIndex(1, 6).State).toEqual(TileState.Blinking);
    });

    it('should check state of starting neighbor blocks', () => {
      var tiles: Tile[] = (<any>MockMapService)._tiles;
      tiles.forEach(tile => {
        tile.TileType = TileType.Block;
      });
      //the block to move
      MockMapService.GetTileByIndex(2, 2).TileType = TileType.DiamondBlock;
      //the row of floor tiles
      MockMapService.GetTileByIndex(3, 2).TileType = TileType.Floor;
      MockMapService.GetTileByIndex(4, 2).TileType = TileType.Floor;
      //the blocks around the first tile location
      let topBlock = MockMapService.GetTileByIndex(2, 3);
      topBlock.TileType = TileType.DiamondBlock;
      topBlock.State = TileState.Blinking;

      let bottomBlock = MockMapService.GetTileByIndex(2, 1);
      bottomBlock.TileType = TileType.DiamondBlock;
      bottomBlock.State = TileState.Blinking;

      let leftBlock = MockMapService.GetTileByIndex(1, 2);
      leftBlock.TileType = TileType.DiamondBlock;
      leftBlock.State = TileState.Blinking;

      jasmine.clock().install();
      AiService.PenguinInteraction(1, 2, Direction.right);
      jasmine.clock().tick(1800);
      jasmine.clock().uninstall();
      expect(topBlock.State).toEqual(TileState.None);
      expect(bottomBlock.State).toEqual(TileState.None);
      expect(leftBlock.State).toEqual(TileState.None);
    });
  });
});

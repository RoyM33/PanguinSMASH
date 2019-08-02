import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Tile } from './Tile';
import { MapService } from '../services/map.service';
import { TileType } from './TileType';
import { TileState } from './TileState';

describe('Tile', () => {
    let MockMapService: MapService;

    beforeEach(() => {
        MockMapService = new MapService();
        MockMapService.GenerateNewMap(10, 10);
        TestBed.configureTestingModule({
            providers: [{ provide: MapService, useValue: MockMapService }]
        });
        let tiles: Tile[] = MockMapService.Tiles;
        tiles.forEach(tile => {
            tile.TileType = TileType.Floor;
        });
    });

    it('should be created', () => {
        let tile = MockMapService.GetTileByIndex(0, 0);
        expect(tile).toBeTruthy();
    });

    describe('TouchingDiamondTile', () => {
        it('should return true when touch diamond tile', () => {
            let tile = MockMapService.GetTileByIndex(2, 2);
            for (var i = 0; i < 4; i++) {
                let diamondTile: Tile;
                switch (i) {
                    case 0:
                        diamondTile = MockMapService.GetTileByIndex(1, 2);
                        break;
                    case 1:
                        diamondTile = MockMapService.GetTileByIndex(3, 2);
                        break;
                    case 2:
                        diamondTile = MockMapService.GetTileByIndex(2, 1);
                        break;
                    case 3:
                        diamondTile = MockMapService.GetTileByIndex(2, 3);
                        break;

                }
                if (!diamondTile)
                    fail("No tile was found for Index: " + i);

                diamondTile.TileType = TileType.DiamondBlock;
                expect(tile.TouchingDiamondTile()).toBeTruthy();
                diamondTile.TileType = TileType.Floor;
            }
        });
        it('should return false when not touching diamond tile', () => {
            let tile = MockMapService.GetTileByIndex(2, 2);
            expect(tile.TouchingDiamondTile()).toBeFalsy();
        });
    });

    describe('checkState', () => {
        it('should not be blinking if not diamond next to diamond', () => {
            let tile = MockMapService.GetTileByIndex(2, 2);
            tile.CheckState();
            expect(tile.State).toEqual(TileState.None);
        });

        it('should be blinking if diamond next to diamond', () => {
            let tile = MockMapService.GetTileByIndex(2, 2);
            tile.TileType = TileType.DiamondBlock;
            MockMapService.GetTileByIndex(1, 2).TileType = TileType.DiamondBlock;
            tile.CheckState();
            expect(tile.State).toEqual(TileState.Blinking);
        });

        it('should not be blinking when moved from next to diamond', () => {
            let tile = MockMapService.GetTileByIndex(2, 2);
            tile.TileType = TileType.DiamondBlock;
            MockMapService.GetTileByIndex(1, 2).TileType = TileType.DiamondBlock;
            tile.CheckState();
            expect(tile.State).toEqual(TileState.Blinking);
            MockMapService.GetTileByIndex(1, 2).TileType = TileType.Floor;
            tile.CheckState();
            expect(tile.State).toEqual(TileState.None);
        });
    });
});
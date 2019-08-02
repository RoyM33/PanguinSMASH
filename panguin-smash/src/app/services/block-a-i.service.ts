import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';
import { debug } from 'util';
import { GameControllerService } from './game-controller.service';

@Injectable({
  providedIn: 'root'
})
export class BlockAIService {
  constructor(private _mapService: MapService, private _gameController: GameControllerService) {

  }

  public PenguinInteraction(tileInteractingWith: Tile, direction: Direction) {
    if (tileInteractingWith.TileType == TileType.Snobee) {
      this._gameController.DeadPanguin();
      return;
    }

    let nextTile = this._mapService.LookAhead(tileInteractingWith.columnIndex, tileInteractingWith.rowIndex, direction);
    if (!nextTile) {
      if (tileInteractingWith.TileType == TileType.Block)
        tileInteractingWith.TileType = TileType.Floor;

      return;
    }

    if (nextTile.TileType != TileType.Floor) {
      if (tileInteractingWith.TileType == TileType.DiamondBlock)
        return;

      tileInteractingWith.TileType = TileType.Floor;
      return;
    }

    if (nextTile.TileType == TileType.Floor) {
      var originalTileType = tileInteractingWith.TileType;
      tileInteractingWith.TileType = TileType.Floor;
      tileInteractingWith.CheckState();
      this.ContinuallyMoveTile(originalTileType, nextTile, direction);
    }
  }

  private ContinuallyMoveTile(newTileType: TileType, nextTile: Tile, direction: Direction) {
    nextTile.TileType = newTileType;
    let tileMoving = nextTile;
    nextTile = this._mapService.LookAhead(tileMoving.columnIndex, tileMoving.rowIndex, direction);
    if (nextTile && nextTile.TileType == TileType.Floor) {
      setTimeout(() => {
        let originalTileType = tileMoving.TileType;
        tileMoving.TileType = TileType.Floor;
        this.ContinuallyMoveTile(originalTileType, nextTile, direction);
      }, 120);
    }
    else {
      tileMoving.CheckState();
    }
  }


}



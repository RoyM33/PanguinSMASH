import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';

@Injectable({
  providedIn: 'root'
})
export class BlockAIService {
  constructor(public _mapService: MapService) {

  }

  public CheckBlock(columnIndex: number, rowIndex: number, direction: Direction) {
    let tile = this._mapService.GetTileByIndex(columnIndex, rowIndex);
    this.RecursiveChecks(tile, direction, false);
  }

  private RecursiveChecks(tile: Tile, direction: Direction, currentlyMoving: boolean) {
    const nextTile = this._mapService.LookAhead(tile.columnIndex, tile.rowIndex, direction, 1);
    if (this.BlockSupportsMovement(nextTile)) {
      const nextNexTile = this._mapService.LookAhead(nextTile.columnIndex, nextTile.rowIndex, direction, 1);
      if (this.ShouldDestroyBlock(nextTile, nextNexTile)) {
        //If we are currently moving then stop moving instead of destroying the block
        if (currentlyMoving) {
          this.TileHasStopped(nextTile);
          return;
        }
        nextTile.Clear();
      }
      else if (this.CanMoveBlock(nextTile, nextNexTile)) {
        currentlyMoving = true;
        //make the next tile the current tile then make the current tile a floor
        nextNexTile.tileType = nextTile.tileType;
        nextTile.tileType = TileType.Floor;
        //Continue to attempt moving the blocks
        setTimeout(() => {
          this.RecursiveChecks(nextTile, direction, currentlyMoving);
        }, 120);
      }
      else if (currentlyMoving) {
        this.TileHasStopped(nextTile);
      }
    }
  }

  private BlockSupportsMovement(blockToCheck: Tile) {
    if (blockToCheck.tileType == TileType.Floor)
      return false;

    return true;
  }

  private CanMoveBlock(blockToCheck: Tile, nextBlock: Tile) {
    if (nextBlock.tileType == TileType.Floor)
      return true;

    return false;
  }

  private ShouldDestroyBlock(blockToCheck: Tile, nextBlock: Tile) {
    //Only regular blocks can be destroyed
    if (blockToCheck.tileType != TileType.Block)
      return false;

    if (nextBlock == null)
      return true;

    if (nextBlock.tileType == TileType.Block)
      return true;

    if (nextBlock.tileType == TileType.DiamondBlock)
      return true;

    return false;
  }

  private TileHasStopped(blockThatHasStopped: Tile) {
    blockThatHasStopped.CheckNearbyTiles();
  }
}



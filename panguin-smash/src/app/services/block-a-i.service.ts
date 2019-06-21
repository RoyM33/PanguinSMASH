import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';
import { debug } from 'util';

@Injectable({
  providedIn: 'root'
})
export class BlockAIService {
  constructor(public _mapService: MapService) {

  }

  public PenguinInteraction(columnIndex: number, rowIndex: number, direction: Direction) {
    let tileInteractingWith = this._mapService.LookAhead(columnIndex, rowIndex, direction);
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
      this.ContinuallyMoveTile(tileInteractingWith, nextTile, direction);
      tileInteractingWith.CheckState();
      this.CheckStateOfNeighbors(tileInteractingWith);
    }
  }

  private ContinuallyMoveTile(tileMoving: Tile, nextTile: Tile, direction: Direction) {
    nextTile.TileType = tileMoving.TileType;
    tileMoving.TileType = TileType.Floor;
    tileMoving = nextTile;
    nextTile = this._mapService.LookAhead(tileMoving.columnIndex, tileMoving.rowIndex, direction);
    if (nextTile && nextTile.TileType == TileType.Floor) {
      setTimeout(() => {
        this.ContinuallyMoveTile(tileMoving, nextTile, direction);
      }, 120);
    }
    else {
      tileMoving.CheckState();
      this.CheckStateOfNeighbors(tileMoving);
    }
  }

  private CheckStateOfNeighbors(tile: Tile) {
    var neighbors = this._mapService.LookInEveryDirection(tile);
    neighbors.forEach(tile => { console.log(tile); tile.CheckState(); });
  }

  // private LookAhead(tile: Tile, direction: Direction, currentlyMoving: boolean) {
  //   const nextTile = this._mapService.LookAhead(tile.columnIndex, tile.rowIndex, direction);
  //   if (this.BlockHasInteraction(nextTile)) {
  //     const nextNexTile = this._mapService.LookAhead(nextTile.columnIndex, nextTile.rowIndex, direction);
  //     if (this.ShouldDestroyBlock(nextTile, nextNexTile)) {
  //       //If we are currently moving then stop moving instead of destroying the block
  //       if (currentlyMoving) {
  //         this.TileHasStopped(nextTile);
  //         return;
  //       }
  //       nextTile.Clear();
  //     }
  //     else if (this.CanMoveBlock(nextTile, nextNexTile)) {
  //       currentlyMoving = true;
  //       //make the next tile the current tile then make the current tile a floor
  //       nextNexTile.tileType = nextTile.tileType;
  //       nextTile.tileType = TileType.Floor;
  //       //Continue to attempt moving the blocks
  //       setTimeout(() => {
  //         this.LookAhead(nextTile, direction, currentlyMoving);
  //       }, 120);
  //     }
  //     else if (currentlyMoving) {
  //       this.TileHasStopped(nextTile);
  //     }
  //   }
  // }

  // private BlockHasInteraction(blockToCheck: Tile) {
  //   //Floors dont interact they just get walked on.
  //   if (blockToCheck.tileType == TileType.Floor)
  //     return false;

  //   return true;
  // }

  // private CanMoveBlock(blockToCheck: Tile, nextBlock: Tile) {
  //   if (nextBlock.tileType == TileType.Floor)
  //     return true;

  //   return false;
  // }

  // private ShouldDestroyBlock(blockToCheck: Tile, nextBlock: Tile) {
  //   //Only regular blocks can be destroyed
  //   if (blockToCheck.tileType != TileType.Block)
  //     return false;

  //   if (nextBlock == null)
  //     return true;

  //   if (nextBlock.tileType == TileType.Block)
  //     return true;

  //   if (nextBlock.tileType == TileType.DiamondBlock)
  //     return true;

  //   return false;
  // }

  // private TileHasStopped(blockThatHasStopped: Tile) {
  //   blockThatHasStopped.CheckNearbyTiles();
  // }
}



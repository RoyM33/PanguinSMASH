import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { BlockAIService } from './block-a-i.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Subject } from 'rxjs';
import { Tile } from '../helpers/Tile';
import { ILocation } from '../interfaces/ILocation';
import { SubjectContainerService } from './subject-container.service';

@Injectable({
  providedIn: 'root'
})
export class PenguinControllerService {

  public get MAXSPEED() {
    return 150;
  }

  private _columnIndex: number;
  private _rowIndex: number;

  public get Location(): ILocation {
    return { Column: this._columnIndex, Row: this._rowIndex };
  }

  public set Location(location: ILocation) {
    this._rowIndex = location.Row;
    this._columnIndex = location.Column;
  }

  constructor(private _mapService: MapService, private _blockAIService: BlockAIService, private _subjectContainer: SubjectContainerService) {

  }

  public SpawnPenguin(columnIndex: number = 4, rowIndex: number = 5) {
    this._columnIndex = columnIndex;
    this._rowIndex = rowIndex;
    this.GetValidSpawnLocation();
  }

  public InteractUp() {
    if (this._rowIndex > 0) {
      let nextTile = this.nextTile(Direction.up);
      if (nextTile.TileType == TileType.Floor) {
        this._rowIndex--;
        this._subjectContainer.PenguinSubject.next(this.Location);
      }
      else {
        this._blockAIService.PenguinInteraction(nextTile, Direction.up);
      }
    }
  }

  public InteractDown() {
    //-1 because we move based on index not length
    if (this._rowIndex < this._mapService.rowLength - 1) {
      let nextTile = this.nextTile(Direction.down);
      if (nextTile.TileType == TileType.Floor) {
        this._rowIndex++;
        this._subjectContainer.PenguinSubject.next(this.Location);
      }
      else {
        this._blockAIService.PenguinInteraction(nextTile, Direction.down);
      }
    }
  }

  public InteractLeft() {
    if (this._columnIndex > 0) {
      let nextTile = this.nextTile(Direction.left);
      if (nextTile.TileType == TileType.Floor) {
        this._columnIndex--;
        this._subjectContainer.PenguinSubject.next(this.Location);
      }
      else {
        this._blockAIService.PenguinInteraction(nextTile, Direction.left);
      }
    }
  }

  public InteractRight() {
    //-1 because we move based on index not length
    if (this._columnIndex < this._mapService.columnLength - 1) {
      let nextTile = this.nextTile(Direction.right);
      if (nextTile.TileType == TileType.Floor) {
        this._columnIndex++;
        this._subjectContainer.PenguinSubject.next(this.Location);
      }
      else {
        this._blockAIService.PenguinInteraction(nextTile, Direction.right);
      }
    }
  }

  public IsHere(column: number, row: number) {
    if (this._columnIndex == column && this._rowIndex == row)
      return true;
    return false;
  }

  private GetValidSpawnLocation() {
    var currentTile = this._mapService.GetTileByIndex(this._columnIndex, this._rowIndex);
    var validSpawn = this.LookForValidSpawnPoint(currentTile, []);
    this.Location = { Column: validSpawn.columnIndex, Row: validSpawn.rowIndex };
    this._subjectContainer.PenguinSubject.next(this.Location);
  }

  public count = 0;

  private LookForValidSpawnPoint(currentTile: Tile, previousTiles: Tile[]) {
    if (currentTile.CanSpawnPenguin())
      return currentTile;

    previousTiles.push(currentTile);
    var neighborTiles = this._mapService.LookInEveryDirection(currentTile).map(item => item.Tile).filter(tile => previousTiles.indexOf(tile) == -1);
    if (neighborTiles.length < 1)
      return null;

    for (var index = 0; index < neighborTiles.length; index++) {
      var neighborTile = neighborTiles[index];
      if (neighborTile) {
        var validSpawn = this.LookForValidSpawnPoint(neighborTile, previousTiles);
        if (validSpawn)
          return validSpawn;
      }
    }

    return null;
  }

  private nextTile(direction: Direction) {
    return this._mapService.LookAhead(this._columnIndex, this._rowIndex, direction);
  }
}

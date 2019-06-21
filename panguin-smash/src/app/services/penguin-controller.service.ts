import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { BlockAIService } from './block-a-i.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Subject } from 'rxjs';
import { Tile } from '../helpers/Tile';

@Injectable({
  providedIn: 'root'
})
export class PenguinControllerService {

  public get MAXSPEED() {
    return 150;
  }

  private _columnIndex: number;
  private _rowIndex: number;

  public PenguinSubject = new Subject();

  public get Location() {
    return { Column: this._columnIndex, Row: this._rowIndex };
  }

  public set Location(location: { Column: number, Row: number }) {
    this._rowIndex = location.Row;
    this._columnIndex = location.Column;
  }

  constructor(private _mapService: MapService, private _blockAIService: BlockAIService) {

  }

  public SpawnPenguin(columnIndex: number = 4, rowIndex: number = 5) {
    this._columnIndex = columnIndex;
    this._rowIndex = rowIndex;
    this.GetValidSpawnLocation();
  }

  public InteractUp() {
    if (this._rowIndex > 0) {
      if (this.nextTile(Direction.up).TileType == TileType.Floor)
        this._rowIndex--;
      else
        this._blockAIService.PenguinInteraction(this._columnIndex, this._rowIndex, Direction.up);

      this.PenguinSubject.next();
    }
  }

  public InteractDown() {
    //-1 because we move based on index not length
    if (this._rowIndex < this._mapService.rowLength - 1) {
      if (this.nextTile(Direction.down).TileType == TileType.Floor)
        this._rowIndex++;
      else
        this._blockAIService.PenguinInteraction(this._columnIndex, this._rowIndex, Direction.down);

      this.PenguinSubject.next();
    }
  }

  public InteractLeft() {
    if (this._columnIndex > 0) {
      if (this.nextTile(Direction.left).TileType == TileType.Floor)
        this._columnIndex--;
      else
        this._blockAIService.PenguinInteraction(this._columnIndex, this._rowIndex, Direction.left);

      this.PenguinSubject.next();
    }
  }

  public InteractRight() {
    //-1 because we move based on index not length
    if (this._columnIndex < this._mapService.columnLength - 1) {
      if (this.nextTile(Direction.right).TileType == TileType.Floor)
        this._columnIndex++;
      else
        this._blockAIService.PenguinInteraction(this._columnIndex, this._rowIndex, Direction.right);

      this.PenguinSubject.next();
    }
  }

  public IsHere(column: number, row: number) {
    if (this._columnIndex == column && this._rowIndex == row)
      return true;
    return false;
  }

  private GetValidSpawnLocation() {
    var currentTile = this._mapService.GetTileByIndex(this._columnIndex, this._rowIndex);
    var validSpawn = this.LookForValidSpawnPoint(currentTile);
    this.Location = { Column: validSpawn.columnIndex, Row: validSpawn.rowIndex };
    this.PenguinSubject.next();
  }

  private LookForValidSpawnPoint(currentTile: Tile) {
    var neighborTiles = this._mapService.LookInEveryDirection(currentTile);
    var availableTiles = neighborTiles.filter(tile => tile.TileType == TileType.Floor);
    if (availableTiles.length > 0)
      return availableTiles[0];

    for (var index = 0; index < neighborTiles.length; index++) {
      var neighborTile = neighborTiles[index];
      if (neighborTile) {
        var validSpawn = this.LookForValidSpawnPoint(neighborTile);
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

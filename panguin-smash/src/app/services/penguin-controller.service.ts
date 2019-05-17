import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { BlockAIService } from './block-a-i.service';
import { Direction } from '../helpers/Directions';
import { TileType } from '../helpers/TileType';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PenguinControllerService {

  public get MAXSPEED() {
    return 150;
  }

  private _columnIndex: number = 4;
  private _rowIndex: number = 5;

  public PenguinSubject = new Subject();

  public get Location() {
    return { Column: this._columnIndex, Row: this._rowIndex };
  }

  constructor(private _mapService: MapService, private _blockAIService: BlockAIService) {
  }

  public MoveUp() {
    if (this._rowIndex > 0) {
      if (this.nextTile(Direction.up).tileType == TileType.Floor)
        this._rowIndex--;
      else
        this._blockAIService.CheckBlock(this._columnIndex, this._rowIndex, Direction.up);

      this.PenguinSubject.next();
    }
  }

  public MoveDown() {
    //-1 because we move based on index not length
    if (this._rowIndex < this._mapService.rowLength - 1) {
      if (this.nextTile(Direction.down).tileType == TileType.Floor)
        this._rowIndex++;
      else
        this._blockAIService.CheckBlock(this._columnIndex, this._rowIndex, Direction.down);

      this.PenguinSubject.next();
    }
  }

  public MoveLeft() {
    if (this._columnIndex > 0) {
      if (this.nextTile(Direction.left).tileType == TileType.Floor)
        this._columnIndex--;
      else
        this._blockAIService.CheckBlock(this._columnIndex, this._rowIndex, Direction.left);

      this.PenguinSubject.next();
    }
  }

  public MoveRight() {
    //-1 because we move based on index not length
    if (this._columnIndex < this._mapService.columnLength - 1) {
      if (this.nextTile(Direction.right).tileType == TileType.Floor)
        this._columnIndex++;
      else
        this._blockAIService.CheckBlock(this._columnIndex, this._rowIndex, Direction.right);

      this.PenguinSubject.next();
    }
  }

  public IsHere(column: number, row: number) {
    if (this._columnIndex == column && this._rowIndex == row)
      return true;
    return false;
  }

  private nextTile(direction: Direction) {
    return this._mapService.LookAhead(this._columnIndex, this._rowIndex, direction, 1);
  }
}

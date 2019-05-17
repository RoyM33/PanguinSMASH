import { Injectable, HostListener } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';
import { Direction } from '../helpers/Directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public get columnLength() {
    return 13;
  }
  public get rowLength() {
    return 15;
  }

  private _maxLength = 20;
  public get MaxIndex() {
    return this._maxLength - 1;
  }

  private _rows = Array(this.rowLength).fill(0).map((x, i) => i);
  private _columns = Array(this.columnLength).fill(0).map((x, i) => i);
  private _tiles: Tile[] = [];

  public get Rows() {
    return this._rows;
  }
  public get Columns() {
    return this._columns;
  }

  constructor() { }

  public GenerateNewMap() {
    for (let rowIndex = 0; rowIndex < this.rowLength; rowIndex++) {
      for (let colIndex = 0; colIndex < this.columnLength; colIndex++) {
        let newTile = new Tile(this, colIndex, rowIndex);
        let tileType = Math.floor(Math.random() * 10);
        if (!(tileType % 2))
          newTile.tileType = TileType.Block;

        this._tiles.push(newTile);
      }
    }
    for (let diamondIndex = 0; diamondIndex < 3; diamondIndex++) {
      let randomTileIndex = Math.floor(Math.random() * this._tiles.length) + 1;
      let tile = this._tiles[randomTileIndex];
      if (tile.tileType != TileType.DiamondBlock) {
        tile.tileType = TileType.DiamondBlock;
      }
      else {
        diamondIndex--;
      }

    }
  }

  public GetTileByIndex(columnIndex: number, rowIndex: number) {
    for (var tileIndex = 0; tileIndex < this._tiles.length; tileIndex++) {
      var tile = this._tiles[tileIndex];
      if (tile.columnIndex == columnIndex && tile.rowIndex == rowIndex)
        return tile;
    }
    return null;
  }

  public LookAhead(columnIndex: number, rowIndex: number, direction: Direction, amount: number): Tile {
    switch (direction) {
      case Direction.down:
        return this.GetTileByIndex(columnIndex, rowIndex + amount);
      case Direction.up:
        return this.GetTileByIndex(columnIndex, rowIndex - amount);
      case Direction.left:
        return this.GetTileByIndex(columnIndex - 1, rowIndex);
      case Direction.right:
        return this.GetTileByIndex(columnIndex + 1, rowIndex);
    }
  }
}


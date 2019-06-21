import { Injectable, HostListener } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';
import { Direction } from '../helpers/Directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _columnLength: number = 0;
  public get columnLength() {
    return this._columnLength;
  }
  private _rowLength: number = 0;
  public get rowLength() {
    return this._rowLength;
  }

  private _rows = [];
  private _columns = [];
  private _tiles: Tile[] = [];

  public get Rows() {
    return this._rows;
  }
  public get Columns() {
    return this._columns;
  }

  constructor() {
  }

  public GenerateNewMap(columnLength: number, rowLength: number) {
    this.CreateColumnsAndRows(columnLength, rowLength);
    this.GenerateTiles();
    this.GenerateDiamondTiles();
  }

  public GetTileByIndex(columnIndex: number, rowIndex: number) {
    var startingIndex = rowIndex * (this.columnLength - 1);
    if (startingIndex < 0)
      return null;

    for (var tileIndex = rowIndex * (this.columnLength - 1); tileIndex < this._tiles.length; tileIndex++) {
      var tile = this._tiles[tileIndex];
      if (tile.columnIndex == columnIndex && tile.rowIndex == rowIndex)
        return tile;
    }
    return null;
  }

  public LookAheadByTile(tile: Tile, direction: Direction) {
    return this.LookAhead(tile.columnIndex, tile.rowIndex, direction);
  }

  public LookAhead(columnIndex: number, rowIndex: number, direction: Direction): Tile {
    switch (direction) {
      case Direction.down:
        return this.GetTileByIndex(columnIndex, rowIndex + 1);
      case Direction.up:
        return this.GetTileByIndex(columnIndex, rowIndex - 1);
      case Direction.left:
        return this.GetTileByIndex(columnIndex - 1, rowIndex);
      case Direction.right:
        return this.GetTileByIndex(columnIndex + 1, rowIndex);
    }
  }

  public LookInEveryDirection(tile: Tile) {
    const columnIndex = tile.columnIndex;
    const rowIndex = tile.rowIndex;
    let result: Tile[] = [];
    result.push(this.GetTileByIndex(columnIndex, rowIndex + 1));
    result.push(this.GetTileByIndex(columnIndex, rowIndex - 1));
    result.push(this.GetTileByIndex(columnIndex + 1, rowIndex));
    result.push(this.GetTileByIndex(columnIndex - 1, rowIndex));
    return result.filter(result => result);
  }

  private CreateColumnsAndRows(columnLength: number, rowLength: number) {
    this._columnLength = columnLength;
    this._columns = Array(this.columnLength).fill(0).map((x, i) => i);
    this._rowLength = rowLength;
    this._rows = Array(this.rowLength).fill(0).map((x, i) => i);
  }

  private GenerateTiles() {
    for (let rowIndex = 0; rowIndex < this.rowLength; rowIndex++) {
      for (let colIndex = 0; colIndex < this.columnLength; colIndex++) {
        let newTile = new Tile(this, colIndex, rowIndex);
        let tileType = Math.floor(Math.random() * 10);
        if (!(tileType % 2))
          newTile.TileType = TileType.Block;

        this._tiles.push(newTile);
      }
    }
  }

  private GenerateDiamondTiles() {

    let validTiles = this._tiles.filter(tile => this.IsTileAvailableToBeDiamond(tile));
    if (validTiles.length <= 0) {
      return;
    }

    let lengthOfValidTiles = validTiles.length;
    var maxNumberOfDiamonds = Math.min(lengthOfValidTiles, 3);
    for (let diamondIndex = 0; diamondIndex < maxNumberOfDiamonds; diamondIndex++) {
      let randomTileIndex = Math.floor(Math.random() * (lengthOfValidTiles - 1));
      let tile = validTiles[randomTileIndex];

      tile.TileType = TileType.DiamondBlock;
      validTiles = validTiles.filter(tile => this.IsTileAvailableToBeDiamond(tile));
      lengthOfValidTiles = validTiles.length;


      if (lengthOfValidTiles <= 0) {
        return;
      }
    }
  }

  private IsTileAvailableToBeDiamond(tile: Tile) {
    if (tile.rowIndex == 0)
      return false;
    if (tile.columnIndex == 0)
      return false;
    if (tile.columnIndex == this.columnLength - 1)
      return false;
    if (tile.rowIndex == this.rowLength - 1)
      return false;

    if (tile.TouchingDiamondTile())
      return false;

    if (tile.TileType == TileType.DiamondBlock)
      return false;

    return true;
  }
}


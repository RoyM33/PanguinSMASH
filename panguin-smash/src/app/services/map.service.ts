import { Injectable, HostListener } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { TileType } from '../helpers/TileType';
import { Tile } from '../helpers/Tile';
import { Direction } from '../helpers/Directions';
import { EventHandler } from '../helpers/EventHandler';
import { NeighborTile } from '../helpers/NeighborTile';
import { debug } from 'util';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public mapGenerationSpeed = 10;
  public OnLoadComplete = new EventHandler();

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
  public Tiles: Tile[] = [];

  public get Rows() {
    return this._rows;
  }
  public get Columns() {
    return this._columns;
  }

  public async GenerateNewMap(columnLength: number, rowLength: number) {
    this.CreateColumnsAndRows(columnLength, rowLength);
    this.Tiles.splice(0);
    this.GenerateTiles();
    await this.GenerateMap();
    this.GenerateDiamondTiles();
    this.OnLoadComplete.Invoke();
  }

  public GetTileByIndex(columnIndex: number, rowIndex: number) {
    var startingIndex = rowIndex * (this.columnLength - 1);
    if (startingIndex < 0)
      return null;

    for (var tileIndex = rowIndex * (this.columnLength - 1); tileIndex < this.Tiles.length; tileIndex++) {
      var tile = this.Tiles[tileIndex];
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
    let result: NeighborTile[] = [];
    result.push({ Tile: this.LookAheadByTile(tile, Direction.left), Direction: Direction.left });
    result.push({ Tile: this.LookAheadByTile(tile, Direction.right), Direction: Direction.right });
    result.push({ Tile: this.LookAheadByTile(tile, Direction.up), Direction: Direction.up });
    result.push({ Tile: this.LookAheadByTile(tile, Direction.down), Direction: Direction.down });
    //dont return null items
    return result.filter(r => r.Tile);
  }

  public LookDiagonally(tile: Tile) {
    const columnIndex = tile.columnIndex;
    const rowIndex = tile.rowIndex;
    let result: Tile[] = [];
    result.push(this.GetTileByIndex(columnIndex - 1, rowIndex + 1));
    result.push(this.GetTileByIndex(columnIndex + 1, rowIndex + 1));
    result.push(this.GetTileByIndex(columnIndex - 1, rowIndex - 1));
    result.push(this.GetTileByIndex(columnIndex + 1, rowIndex - 1));
    //dont return null items
    return result.filter(r => r);
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
        // let tileType = Math.floor(Math.random() * 10);
        // if (!(tileType % 2))
        newTile.TileType = TileType.Block;

        this.Tiles.push(newTile);
      }
    }
  }

  private async GenerateMap() {
    let originatingTile = this.Tiles[0];
    while (true) {
      await this.CreateAPath(originatingTile);
      let found = false;
      for (var index = 0; index < this.Tiles.length; index++) {
        const tile = this.Tiles[index];
        if (tile.TileType == TileType.Floor)
          continue;

        const neighbors = this.LookInEveryDirection(tile).map(item => item.Tile).filter(item => item.TileType == TileType.Block);
        if (neighbors.length >= 3) {
          originatingTile = tile;
          found = true;
          break;
          // if (neighbors.length == 4) {
          //   break;
          // }
        }

      }
      if (!found)
        break;
    }
    let found = true;
    while (found) {
      found = false;
      for (var index = 0; index < this.Tiles.length; index++) {
        let tile = this.Tiles[index];
        let neighbors = this.LookInEveryDirection(tile).filter(neighbor => neighbor.Tile.TileType == TileType.Floor);
        if (neighbors.length == 4) {
          let randomNeighbor = neighbors[Math.floor(Math.random() * 3)];
          randomNeighbor.Tile.TileType = TileType.Block;
          tile.TileType = TileType.Floor;
          found = true;
        }
      }
    }
  }

  private async CreateAPath(currentTile: Tile) {
    let currentDirection: Direction;
    await new Promise((resolver, rejector) => {
      let timer = window.setInterval(() => {
        currentTile.TileType = TileType.Floor;
        let availableTiles = this.GetAvailableTiles(currentTile, currentDirection);
        if (availableTiles.length == 0) {
          window.clearInterval(timer);
          resolver();
        }
        else if (availableTiles.length == 1) {
          let item = availableTiles[0];
          currentTile = item.Tile;
          currentDirection = item.Direction;
        }
        else {
          let randomblock = Math.floor(Math.random() * (availableTiles.length));
          let item = availableTiles[randomblock];
          currentTile = item.Tile;
          currentDirection = item.Direction;
        }
      }, this.mapGenerationSpeed);
    });
  }

  private GetAvailableTiles(currentTile: Tile, direction: Direction) {
    var availableTiles: NeighborTile[] = [];
    let neighbors = this.LookInEveryDirection(currentTile).filter(neighbor => neighbor.Tile.TileType != TileType.Floor);

    for (var index = 0; index < neighbors.length; index++) {
      let neighbor = neighbors[index];
      let nextNeighbors = this.LookInEveryDirection(neighbor.Tile).filter(item => item.Tile != currentTile);
      for (var index2; index2 < nextNeighbors.length; index2++) {
        let nextNeighbor = nextNeighbors[index2];
        if (nextNeighbor.Direction == neighbor.Direction) {
          neighbor.Tile.TileType = TileType.Floor;
        }
        else if (nextNeighbor.Tile.TileType == TileType.Floor) {
          break;
        }
      }
      nextNeighbors = nextNeighbors.filter(item => item.Tile.TileType == TileType.Floor);
      if (nextNeighbors.length == 0) {
        let cornerNeighbors = this.LookDiagonally(neighbor.Tile).filter(item => item.TileType == TileType.Block);
        if (cornerNeighbors.length > 0) {
          availableTiles.push(neighbor);
          if (neighbor.Direction == direction)
            availableTiles.push(neighbor);
        }
      }
    }
    if (availableTiles.length == 0 && neighbors.length > 2) {
      for (var index = 0; index < neighbors.length; index++) {
        let neighbor = neighbors[index];
        let nextNeighbors = this.LookInEveryDirection(neighbor.Tile).filter(item => item.Tile != currentTile);
        nextNeighbors = nextNeighbors.filter(item => item.Tile.TileType == TileType.Block);
        if (nextNeighbors.length == 2) {
          availableTiles.push(neighbor);
          break;
        }
      }
    }

    return availableTiles;
  }

  private GenerateDiamondTiles() {

    let validTiles = this.Tiles.filter(tile => this.IsTileAvailableToBeDiamond(tile));
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
    if (tile.TileType == TileType.Floor)
      return false;

    return true;
  }
}


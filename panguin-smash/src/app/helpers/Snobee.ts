import { ILocation } from '../interfaces/ILocation';
import { MapService } from '../services/map.service';
import { Direction } from './Directions';
import { TileType } from './TileType';
import { Subject } from 'rxjs';
import { SubjectContainerService } from '../services/subject-container.service';
import { Tile } from './Tile';

export class Snobee {
    public Location: ILocation;

    private get CurrentRow() {
        return this.Location.Row;
    }

    private get CurrentColumn() {
        return this.Location.Column;
    }

    private _panguinBuffer = 4;
    private _currentPanguinLocation: ILocation;

    constructor(private _mapService: MapService, private _subjectContainer: SubjectContainerService) {
        _subjectContainer.PenguinSubject.subscribe(location => this._currentPanguinLocation = location);
    }

    public Spawn() {
        let validTiles = this._mapService.Tiles.filter(tile => tile.TileType == TileType.Floor);
        let validTileCount = validTiles.length;
        let count = 0;
        while (count < 15) {
            count++;
            let randomTileIndex = Math.floor(Math.random() * (validTileCount))
            let randomTile = validTiles[randomTileIndex];
            if (this.CanSpawnOnTile(randomTile)) {
                this.Location = { Column: randomTile.columnIndex, Row: randomTile.rowIndex };
                break;
            }
        }
    }

    private CanSpawnOnTile(Tile: Tile): boolean {
        let panguinColumn = this._currentPanguinLocation.Column;
        let panguinRow = this._currentPanguinLocation.Row;
        if (Tile.columnIndex < panguinColumn - this._panguinBuffer)
            return true;
        if (Tile.columnIndex > panguinColumn + this._panguinBuffer)
            return true;
        if (Tile.rowIndex < panguinRow - this._panguinBuffer)
            return true;
        if (Tile.rowIndex > panguinRow + this._panguinBuffer)
            return true;

        return false;
    }

    public InteractUp(): boolean {
        if (this.CurrentRow <= 0)
            return false;
        if (this.nextTile(Direction.up).TileType == TileType.DiamondBlock)
            return false;

        this.Location.Row--;

        return true;
    }

    public InteractDown(): boolean {
        //-1 because we move based on index not length
        if (this.CurrentRow >= this._mapService.rowLength - 1)
            return false;

        if (this.nextTile(Direction.down).TileType == TileType.DiamondBlock)
            return false;

        this.Location.Row++;
        return true;
    }

    public InteractLeft(): boolean {
        if (this.CurrentColumn <= 0)
            return false;

        if (this.nextTile(Direction.left).TileType == TileType.DiamondBlock)
            return false;

        this.Location.Column--;
        return true;
    }

    public InteractRight(): boolean {
        //-1 because we move based on index not length
        if (this.CurrentColumn >= this._mapService.columnLength - 1)
            return false;

        if (this.nextTile(Direction.right).TileType == TileType.DiamondBlock)
            return false;

        this.Location.Column++;
        return true;
    }

    private nextTile(direction: Direction) {
        return this._mapService.LookAhead(this.CurrentColumn, this.CurrentRow, direction);
    }

    public Move() {
        var directionToMove = Math.floor(Math.random() * (4));
        while (this.AttemptMove(directionToMove) == false) {
            directionToMove = Math.floor(Math.random() * (4));
        }
    }

    private AttemptMove(directioNumber: number): boolean {
        switch (directioNumber) {
            case 0:
                return this.InteractUp();
            case 1:
                return this.InteractDown();
            case 2:
                return this.InteractLeft();
            case 3:
                return this.InteractRight();
        }
        return false;
    }
}
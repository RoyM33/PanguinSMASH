import { TileType } from './TileType';
import { MapService } from '../services/map.service';
import { Direction } from './Directions';

export class Tile {
    private _tileType: TileType = TileType.Floor;
    private _blinkingInterval: number;
    private _glow = false;

    public get tileType() {
        return this._tileType;
    }
    public set tileType(tileType: TileType) {
        this._tileType = tileType;
        this.PopulateClasses();
    }


    public Classes: string[] = [];

    constructor(private _mapService: MapService, public columnIndex: number, public rowIndex: number) {
        this.PopulateClasses();
    }


    public Clear() {
        this.tileType = TileType.Floor;
        this._glow = false;
        this.StopBlinking();
    }

    public CheckNearbyTiles(checkNeighbor: boolean = true) {
        if (this.tileType != TileType.DiamondBlock)
            return;

        let shouldGlow = false;
        const northTile = this._mapService.LookAhead(this.columnIndex, this.rowIndex, Direction.up, 1);
        if (northTile && northTile.tileType == TileType.DiamondBlock) {
            shouldGlow = true;
            if (checkNeighbor)
                northTile.CheckNearbyTiles(false);
        }

        const southTile = this._mapService.LookAhead(this.columnIndex, this.rowIndex, Direction.down, 1);
        if (southTile && southTile.tileType == TileType.DiamondBlock) {
            shouldGlow = true;
            if (checkNeighbor)
                southTile.CheckNearbyTiles(false);
        }

        const eastTile = this._mapService.LookAhead(this.columnIndex, this.rowIndex, Direction.right, 1);
        if (eastTile && eastTile.tileType == TileType.DiamondBlock) {
            shouldGlow = true;
            if (checkNeighbor)
                eastTile.CheckNearbyTiles(false);
        }

        const westTile = this._mapService.LookAhead(this.columnIndex, this.rowIndex, Direction.left, 1);
        if (westTile && westTile.tileType == TileType.DiamondBlock) {
            shouldGlow = true;
            if (checkNeighbor)
                westTile.CheckNearbyTiles(false);
        }

        if (shouldGlow)
            this.BeginBlinking();
        else
            this.StopBlinking();
    }

    private BeginBlinking() {
        this._blinkingInterval = window.setInterval(() => {
            this._glow = !this._glow;
            this.PopulateClasses();
        }, 160);
    }

    private StopBlinking() {
        if (this._blinkingInterval)
            window.clearInterval(this._blinkingInterval);

        this._blinkingInterval = null;
        this._glow = false;
    }

    private PopulateClasses() {
        var result = [];
        if (this.tileType == TileType.Floor)
            result.push("floorTile");
        if (this.tileType == TileType.Block)
            result.push("blockTile");

        if (this._glow)
            result.push("penguin");

        this.Classes = result;
    }
}
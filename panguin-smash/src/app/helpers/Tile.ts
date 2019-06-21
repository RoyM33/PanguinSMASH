import { TileType } from './TileType';
import { MapService } from '../services/map.service';
import { TileState } from './TileState';

export class Tile {
    private _tileType: TileType = TileType.Floor;
    private _blinkingInterval: number;
    private _blinkTimeSpeed = 160;
    private _glow = false;

    public get TileType() {
        return this._tileType;
    }
    public set TileType(tileType: TileType) {
        this._tileType = tileType;
        this.PopulateClasses();
    }

    public Classes: string[] = [];
    private _state: TileState = TileState.None;
    public get State() {
        return this._state;
    }
    public set State(state: TileState) {
        if (state != this._state) {
            this._state = state;
            this.StateHasChanged();
        }
    }

    constructor(private _mapService: MapService, public columnIndex: number, public rowIndex: number) {
        this.PopulateClasses();
    }

    public CheckState() {
        if (this.TileType == TileType.DiamondBlock) {
            if (this.TouchingDiamondTile()) {
                this.State = TileState.Blinking;
                return;
            }
        }

        this.State = TileState.None;
    }

    public TouchingDiamondTile() {
        let surroundingTiles = this._mapService.LookInEveryDirection(this);
        let touchingDiamondTiles = surroundingTiles.filter(tile => tile.TileType == TileType.DiamondBlock).length > 0;
        if (touchingDiamondTiles)
            return true;

        return false;
    }

    private StateHasChanged() {
        if (this.State == TileState.Blinking)
            this.BeginBlinking();
        else
            this.StopBlinking();

        this._mapService.LookInEveryDirection(this).forEach(tile => tile.CheckState());
    }

    private BeginBlinking() {
        if (this._blinkingInterval)
            window.clearInterval(this._blinkingInterval);

        this._blinkingInterval = window.setInterval(() => {
            this._glow = !this._glow;
            this.PopulateClasses();
        }, this._blinkTimeSpeed);
    }

    private StopBlinking() {
        if (this._blinkingInterval)
            window.clearInterval(this._blinkingInterval);

        this._blinkingInterval = null;
        this._glow = false;
        this.PopulateClasses();
    }

    private PopulateClasses() {
        var result = [];
        if (this.TileType == TileType.Floor)
            result.push("floorTile");
        if (this.TileType == TileType.Block)
            result.push("blockTile");

        if (this._glow)
            result.push("penguin");

        this.Classes = result;
    }
}
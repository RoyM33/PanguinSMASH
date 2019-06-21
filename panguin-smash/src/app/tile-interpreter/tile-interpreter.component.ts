import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { PenguinControllerDirective } from '../directives/penguin-controller.directive';
import { TileType } from '../helpers/TileType';
import { CreatureType } from '../helpers/CreatureType';
import { Tile } from '../helpers/Tile';
import { PenguinControllerService } from '../services/penguin-controller.service';

@Component({
  selector: 'tile-interpreter',
  templateUrl: './tile-interpreter.component.html',
  styleUrls: ['./tile-interpreter.component.css']
})
export class TileInterpreterComponent implements OnInit {

  public TileType = TileType;
  public CreatureType = CreatureType;

  @Input('row')
  public RowIndex: number;

  @Input('column')
  public ColumnIndex: number;

  public tile: Tile;
  public CreatureStyle: CreatureType = CreatureType.None;

  constructor(public MapService: MapService, private _penguinService: PenguinControllerService) {
  }

  ngOnInit() {
    this.tile = this.MapService.GetTileByIndex(this.ColumnIndex, this.RowIndex);
    this._penguinService.PenguinSubject.subscribe(_ => {
      if (this._penguinService.IsHere(this.ColumnIndex, this.RowIndex)) {
        this.CreatureStyle = CreatureType.Panguin;
      }
      else {
        this.CreatureStyle = CreatureType.None;
      }
    });
    this._penguinService.SpawnPenguin();
  }

}

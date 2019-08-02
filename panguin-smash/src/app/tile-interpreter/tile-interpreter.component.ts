import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { PenguinControllerDirective } from '../directives/penguin-controller.directive';
import { TileType } from '../helpers/TileType';
import { CreatureType } from '../helpers/CreatureType';
import { Tile } from '../helpers/Tile';
import { PenguinControllerService } from '../services/penguin-controller.service';
import { SubjectContainerService } from '../services/subject-container.service';
import { ILocation } from '../interfaces/ILocation';
import { SnobeeControllerService } from '../services/snobee-controller.service';
import { GameControllerService } from '../services/game-controller.service';

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

  constructor(public MapService: MapService, private _subjectContainer: SubjectContainerService, private _gameController: GameControllerService) {

  }

  ngOnInit() {
    this.tile = this.MapService.GetTileByIndex(this.ColumnIndex, this.RowIndex);
    this._subjectContainer.PenguinSubject.subscribe(penguinLocation => {
      this.CheckForPanguin(penguinLocation);
    });
    this._subjectContainer.SnobeeSubject.subscribe(snobeeLocations => {
      this.CheckForSnobee(snobeeLocations);
    });
  }

  private CheckForPanguin(panguinLocation: ILocation) {
    let shouldChange = this.tile.TileType == TileType.Panguin;
    if (!panguinLocation) {
      if (shouldChange)
        this.tile.TileType = TileType.Block;
      return;
    }
    if (panguinLocation.Column == this.ColumnIndex && panguinLocation.Row == this.RowIndex) {
      this.tile.TileType = TileType.Panguin;
    }
    else if (shouldChange) {
      this.tile.TileType = TileType.Floor;
    }
  }

  private CheckForSnobee(snobeeLocations: ILocation[]) {
    let shouldChange = this.tile.TileType == TileType.Snobee;
    if (!snobeeLocations) {
      if (shouldChange)
        this.tile.TileType = TileType.Block;
      return;
    }
    for (var index = 0; index < snobeeLocations.length; index++) {
      const snobee = snobeeLocations[index];
      if (snobee.Column == this.ColumnIndex && snobee.Row == this.RowIndex) {
        this.tile.TileType = TileType.Snobee;
      }
      else if (shouldChange) {
        this.tile.TileType = TileType.Floor;
      }
    }
  }
}

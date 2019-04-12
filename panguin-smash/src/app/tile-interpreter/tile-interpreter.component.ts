import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { PenguinControllerDirective } from '../directives/penguin-controller.directive';

@Component({
  selector: 'tile-interpreter',
  templateUrl: './tile-interpreter.component.html',
  styleUrls: ['./tile-interpreter.component.css']
})
export class TileInterpreterComponent implements OnInit {

  @Input('row')
  public Row: number;

  @Input('column')
  public Column: number;

  public FloorStyle: string = '';
  public CreatureStyle: string = '';

  constructor(public MapService: MapService, public PenguinController: PenguinControllerDirective) {
  }

  ngOnInit() {
    this.FloorStyle = this.MapService.GetTile(this.Column, this.Row);
    this.PenguinController.PenguinSubject.subscribe(penguin => {
      if (penguin.IsHere(this.Column, this.Row)) {
        this.CreatureStyle = 'penguin';
      }
      else {
        this.CreatureStyle = '';
      }
    });
  }

}

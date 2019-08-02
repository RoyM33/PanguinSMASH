import { Injectable } from '@angular/core';
import { BlockAIService } from './block-a-i.service';
import { MapService } from './map.service';
import { SubjectContainerService } from './subject-container.service';
import { Snobee } from '../helpers/Snobee';

@Injectable({
  providedIn: 'root'
})
export class SnobeeControllerService {

  private _snobees: Snobee[] = [];

  public SnobeeMovementSpeed = 500;

  constructor(private _mapService: MapService, private _blockAIService: BlockAIService, private _subjectContainer: SubjectContainerService) { }

  public SpawnSnobees(amountToSpawn: number) {
    this._snobees.splice(0);
    for (var index = 0; index < amountToSpawn; index++) {
      let newSnobee = new Snobee(this._mapService, this._subjectContainer);
      console.log("Spawning");
      newSnobee.Spawn();
      this._snobees.push(newSnobee);
    }
    this._subjectContainer.SnobeeSubject.next(this._snobees.map(snobee => snobee.Location));
    window.setInterval(() => this.MoveSnobees(), this.SnobeeMovementSpeed);
  }

  public MoveSnobees() {
    this._snobees.forEach(snobee => snobee.Move());
    this._subjectContainer.SnobeeSubject.next(this._snobees.map(snobee => snobee.Location));
  }
}

import { Component } from '@angular/core';
import { MapService } from './services/map.service';
import { PenguinControllerService } from './services/penguin-controller.service';
import { SnobeeControllerService } from './services/snobee-controller.service';
import { GameControllerService } from './services/game-controller.service';
import { SubjectContainerService } from './services/subject-container.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'panguin-smash';
  public Loading = false;

  constructor(public MapService: MapService, public _penguinService: PenguinControllerService, private _snobeeService: SnobeeControllerService, private _gameService: GameControllerService, private _subjectContainer: SubjectContainerService) {

  }

  async ngOnInit() {
    this._gameService.OnNextLife.Add(() => {
      this.ShowNextLifeScreen();
    });
    await this.GenerateNewMap();
  }

  private async GenerateNewMap() {
    this.MapService.OnLoadComplete.Add(() => {
      this._penguinService.SpawnPenguin();
      this._snobeeService.SpawnSnobees(3);
    });
    await this.MapService.GenerateNewMap(13, 15);
  }

  private ShowNextLifeScreen() {
    this.Loading = true;
    this._subjectContainer.PenguinSubject.next();
    this._subjectContainer.SnobeeSubject.next();
    window.setTimeout(() => {
      this.MapService.GenerateNewMap(13, 15);
      this.Loading = false;
    }, 150);
  }
}

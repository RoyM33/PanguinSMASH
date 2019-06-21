import { Directive, HostListener } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';
import { MapService } from '../services/map.service';
import { CreatureType } from '../helpers/CreatureType';
import { TileType } from '../helpers/TileType';
import { BlockAIService } from '../services/block-a-i.service';
import { Direction } from '../helpers/Directions';
import { PenguinControllerService } from '../services/penguin-controller.service';

@Directive({
  selector: '[penguinController]'
})
export class PenguinControllerDirective {

  private _currentKey: KeyStroke;
  //Controls the speed at which the panguin moves while holding a button down.
  private _timeHasElapsed = false;

  @HostListener('document:keydown.w', ['$event'])
  private MoveUpwards() {
    this.TriggerButton(KeyStroke.W);
  }

  @HostListener('document:keydown.a', ['$event'])
  private MoveLeft() {
    this.TriggerButton(KeyStroke.A);
  }

  public downMoveTimeout: number;
  public movingDown: boolean;
  @HostListener('document:keydown.s', ['$event'])
  private MoveDownwards() {
    this.TriggerButton(KeyStroke.S);
  }

  @HostListener('document:keydown.D', ['$event'])
  private MoveRight() {
    this.TriggerButton(KeyStroke.D);
  }

  constructor(private _penguinService: PenguinControllerService) {
  }

  public TriggerButton(keyStroke: KeyStroke) {
    if (keyStroke == this._currentKey) {
      if (!this._timeHasElapsed)
        return false;
    }
    this._timeHasElapsed = false;
    this._currentKey = keyStroke;
    switch (this._currentKey) {
      case KeyStroke.W:
        this._penguinService.InteractUp();
        break;
      case KeyStroke.A:
        this._penguinService.InteractLeft();
        break;
      case KeyStroke.D:
        this._penguinService.InteractRight();
        break;
      case KeyStroke.S:
        this._penguinService.InteractDown();
        break;
    }
    window.setTimeout(() => {
      this._timeHasElapsed = true;
    }, this._penguinService.MAXSPEED);
  }
}

enum KeyStroke {
  none,
  W,
  A,
  S,
  D
}

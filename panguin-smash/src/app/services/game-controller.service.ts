import { Injectable } from '@angular/core';
import { EventHandler } from '../helpers/EventHandler';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService {

  public OnGameOver = new EventHandler();
  public OnNextLife = new EventHandler();

  public DeadPanguin() {
    this.OnNextLife.Invoke();
  }

  public GameOver() {
    this.OnGameOver.Invoke();
  }
}

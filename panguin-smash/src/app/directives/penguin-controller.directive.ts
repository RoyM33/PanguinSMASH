import { Directive, HostListener } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';
import { MapService } from '../services/map.service';

@Directive({
  selector: '[penguinController]'
})
export class PenguinControllerDirective {

  private _penguin: Penguin;


  public PenguinSubject = new Subject<Penguin>();

  @HostListener('window:keydown.w', ['$event'])
  private MoveUpwards() {
    this._penguin.MoveUp();
    this.PenguinSubject.next(this._penguin);
  }

  @HostListener('window:keydown.a', ['$event'])
  private MoveLeft() {
    this._penguin.MoveLeft();
    this.PenguinSubject.next(this._penguin);
  }

  @HostListener('window:keydown.s', ['$event'])
  private MoveDownwards() {
    this._penguin.MoveDown();
    this.PenguinSubject.next(this._penguin);
  }

  @HostListener('window:keydown.d', ['$event'])
  private MoveRight() {
    this._penguin.MoveRight();
    this.PenguinSubject.next(this._penguin);
  }

  constructor(private _mapService: MapService) {
    this._penguin = new Penguin(this._mapService.MaxIndex);
  }

}

export class Penguin {
  private _column: number = 5;
  private _row: number = 5;

  public get Location() {
    return { Column: this._column, Row: this._row };
  }

  constructor(private _maxLength: number) {

  }

  public MoveUp() {
    if (this._row > 0)
      this._row--;
  }

  public MoveDown() {
    if (this._row < this._maxLength)
      this._row++;
  }

  public MoveLeft() {
    if (this._column > 0)
      this._column--;
  }

  public MoveRight() {
    if (this._column < this._maxLength)
      this._column++;
  }

  public IsHere(column: number, row: number) {
    if (this._column == column && this._row == row)
      return true;
    return false;
  }
}

import { Injectable, HostListener } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _maxLength = 20;
  public get MaxIndex() {
    return this._maxLength - 1;
  }

  private _rows = Array(this._maxLength).fill(0).map((x, i) => i);
  private _columns = Array(this._maxLength).fill(0).map((x, i) => i);

  public get Rows() {
    return this._rows;
  }
  public get Columns() {
    return this._columns;
  }

  constructor() { }

  public GenerateNewMap() {

  }

  public GetTile(columnIndex: number, rowIndex: number) {
    if (columnIndex % 2)
      return "block";
    else
      return "floor"
  }
}


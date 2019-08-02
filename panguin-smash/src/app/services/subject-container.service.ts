import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ILocation } from '../interfaces/ILocation';

@Injectable({
  providedIn: 'root'
})
export class SubjectContainerService {
  public PenguinSubject = new ReplaySubject<ILocation>(0);
  public SnobeeSubject = new ReplaySubject<ILocation[]>(0);
}

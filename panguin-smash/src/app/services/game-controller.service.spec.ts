import { TestBed } from '@angular/core/testing';

import { GameControllerService } from './game-controller.service';

describe('GameControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameControllerService = TestBed.get(GameControllerService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SnobeeControllerService } from './snobee-controller.service';

describe('SnobeeControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnobeeControllerService = TestBed.get(SnobeeControllerService);
    expect(service).toBeTruthy();
  });
});

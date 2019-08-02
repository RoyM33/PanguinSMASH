import { TestBed } from '@angular/core/testing';

import { SubjectContainerService } from './subject-container.service';

describe('SubjectContainerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubjectContainerService = TestBed.get(SubjectContainerService);
    expect(service).toBeTruthy();
  });
});

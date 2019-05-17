import { TestBed } from '@angular/core/testing';

import { BlockAIService } from './block-a-i.service';

describe('BlockAIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockAIService = TestBed.get(BlockAIService);
    expect(service).toBeTruthy();
  });
});

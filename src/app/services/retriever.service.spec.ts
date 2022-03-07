import { TestBed } from '@angular/core/testing';

import { RetrieverService } from './retriever.service';

describe('RetrieverService', () => {
  let service: RetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

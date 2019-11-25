import { TestBed } from '@angular/core/testing';

import { RetrospectiveService } from './retrospective.service';

describe('RetrospectiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetrospectiveService = TestBed.get(RetrospectiveService);
    expect(service).toBeTruthy();
  });
});

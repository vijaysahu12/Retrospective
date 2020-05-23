import { TestBed } from '@angular/core/testing';

import { HubConnectionService } from './hub-connection.service';

describe('HubConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HubConnectionService = TestBed.get(HubConnectionService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChangedPasswordService } from './changed-password.service';

describe('ChangedPasswordService', () => {
  let service: ChangedPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangedPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

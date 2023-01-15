import { TestBed } from '@angular/core/testing';

import { ReauthGuard } from './reauth.guard';

describe('ReauthGuard', () => {
  let guard: ReauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

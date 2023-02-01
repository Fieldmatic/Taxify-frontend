import { TestBed } from '@angular/core/testing';

import { FilterDriversService } from './filter-drivers.service';

describe('FilterDriversService', () => {
  let service: FilterDriversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterDriversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

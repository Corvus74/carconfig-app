import { TestBed } from '@angular/core/testing';

import { CarConfigChangeService } from './car-config-change.service';

describe('CarConfigChangeService', () => {
  let service: CarConfigChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarConfigChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

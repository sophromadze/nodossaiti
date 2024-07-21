import { TestBed } from '@angular/core/testing';

import { QueryParamsResloverService } from './query-params-reslover.service';

describe('QueryParamsResloverService', () => {
  let service: QueryParamsResloverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryParamsResloverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

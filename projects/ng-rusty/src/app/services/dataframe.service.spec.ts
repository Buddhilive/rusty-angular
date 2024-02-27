import { TestBed } from '@angular/core/testing';

import { DataframeService } from './dataframe.service';

describe('DataframeService', () => {
  let service: DataframeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataframeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

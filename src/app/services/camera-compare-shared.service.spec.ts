import { TestBed } from '@angular/core/testing';

import { CameraCompareSharedService } from './camera-compare-shared.service';

describe('CameraCompareSharedService', () => {
  let service: CameraCompareSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraCompareSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

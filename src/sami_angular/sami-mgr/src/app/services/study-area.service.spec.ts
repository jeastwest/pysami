import { TestBed } from '@angular/core/testing';

import { StudyAreaService } from './study-area.service';

describe('StudyAreaService', () => {
  let service: StudyAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

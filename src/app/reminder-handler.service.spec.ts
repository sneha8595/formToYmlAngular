import { TestBed } from '@angular/core/testing';

import { ReminderHandlerService } from './reminder-handler.service';

describe('ReminderHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReminderHandlerService = TestBed.get(ReminderHandlerService);
    expect(service).toBeTruthy();
  });
});

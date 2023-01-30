import { TestBed } from '@angular/core/testing';

import { ChatsResolverService } from './chats-resolver.service';

describe('ChatsResolverService', () => {
  let service: ChatsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

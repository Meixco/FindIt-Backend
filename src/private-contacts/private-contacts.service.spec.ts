import { Test, TestingModule } from '@nestjs/testing';
import { PrivateContactsService } from './private-contacts.service.js';

describe('PrivateContactsService', () => {
  let service: PrivateContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateContactsService],
    }).compile();

    service = module.get<PrivateContactsService>(PrivateContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

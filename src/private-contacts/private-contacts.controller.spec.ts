import { Test, TestingModule } from '@nestjs/testing';
import { PrivateContactsController } from './private-contacts.controller.js';

describe('PrivateContactsController', () => {
  let controller: PrivateContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateContactsController],
    }).compile();

    controller = module.get<PrivateContactsController>(PrivateContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { JwtTokenService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

const mockData = {
  id: '1',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\n',
};
describe('JwtTokenService', () => {
  let service: JwtTokenService;

  /**
   * Mocking the jwt service
   */
  const jwtServiceMock = {
    sign: jest.fn().mockImplementation(() => mockData.token),
    verifyAsync: jest.fn().mockImplementation(() => ({ id: mockData.id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a jwt token', () => {
    const token = service.generateJwtToken({ id: mockData.id });
    expect(token).toBeDefined();
  });

  it('should verify a jwt token', async () => {
    const token = service.generateJwtToken({ id: mockData.id });
    const payload = await service.verifyJwtToken(token);
    expect(payload).toBeDefined();
  });
});

import { JwtTokenService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  const jwtServiceMock = {
    sign: jest.fn().mockImplementation(() => 'mockedJwtToken'),
    verifyAsync: jest.fn().mockImplementation(() => ({ id: '1' })),
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
    const token = service.generateJwtToken({ id: '1' });
    expect(token).toBeDefined();
  });

  it('should verify a jwt token', async () => {
    const token = service.generateJwtToken({ id: '1' });
    const payload = await service.verifyJwtToken(token);
    expect(payload).toBeDefined();
  });
});

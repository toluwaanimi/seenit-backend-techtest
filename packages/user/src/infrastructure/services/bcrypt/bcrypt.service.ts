import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IBcryptService } from '../../../domain/adapters';

/**
 * BcryptService
 * @implements {IBcryptService}
 * @class
 * @classdesc Service to hash and compare passwords
 */
@Injectable()
export class BcryptService implements IBcryptService {
  rounds = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}

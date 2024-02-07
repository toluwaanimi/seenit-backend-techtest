import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Gateway Service: Listening to incoming requests!',
    };
  }
}

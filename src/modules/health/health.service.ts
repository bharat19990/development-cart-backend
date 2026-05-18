import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      status: 'ok',
      message: 'Development Cart API is running',
      timestamp: new Date().toISOString(),
    };
  }
}

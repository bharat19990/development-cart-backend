import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  getRoot() {
    return this.healthService.getStatus();
  }

  @Public()
  @Get('health')
  getHealth() {
    return this.healthService.getStatus();
  }
}

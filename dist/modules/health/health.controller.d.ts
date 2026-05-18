import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getRoot(): {
        status: string;
        message: string;
        timestamp: string;
    };
    getHealth(): {
        status: string;
        message: string;
        timestamp: string;
    };
}

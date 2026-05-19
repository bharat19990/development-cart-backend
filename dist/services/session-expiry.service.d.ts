export declare class SessionExpiryService {
    expireSessions(): Promise<number>;
    startInterval(ms?: number): NodeJS.Timeout;
}
export declare const sessionExpiryService: SessionExpiryService;

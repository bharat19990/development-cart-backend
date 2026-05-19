import 'reflect-metadata';
import 'dotenv/config';
export declare const config: {
    nodeEnv: string;
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    enrollmentFeeUsd: number;
    sessionDurationDays: number;
    superadminEmail: string;
    superadminPassword: string;
};

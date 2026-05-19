declare const _default: () => {
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
export default _default;

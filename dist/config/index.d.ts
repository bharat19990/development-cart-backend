import 'dotenv/config';
export declare const config: {
    readonly nodeEnv: string;
    readonly port: number;
    readonly database: {
        url: string | undefined;
    };
    readonly jwt: {
        secret: string;
        expiresIn: string;
    };
};

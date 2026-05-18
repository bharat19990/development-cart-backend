export declare class AppError extends Error {
    readonly statusCode: number;
    readonly messages: string | string[];
    constructor(statusCode: number, messages: string | string[]);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message: string);
}
export declare class ValidationRequestError extends AppError {
    constructor(messages: string[]);
}

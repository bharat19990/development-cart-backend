import { NextFunction, Request, RequestHandler, Response } from 'express';
type RequestHandlerFn = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
export declare function asyncHandler(fn: RequestHandlerFn): RequestHandler;
export {};

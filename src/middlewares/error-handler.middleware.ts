import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.util';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  let message: string | string[];
  if (err instanceof AppError) {
    message = err.messages;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = 'Internal server error';
  }

  if (statusCode >= 500) {
    console.error(`${req.method} ${req.url}`, err);
  }

  res.status(statusCode).json({
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    message,
  });
}

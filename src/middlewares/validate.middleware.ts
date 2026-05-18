import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { ValidationRequestError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';

export function validateBody<T extends object>(
  dtoClass: ClassConstructor<T>,
): RequestHandler {
  return asyncHandler(async (req, _res, next) => {
    const dto = plainToInstance(dtoClass, req.body, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );
      throw new ValidationRequestError(messages);
    }

    req.body = dto;
    next();
  });
}

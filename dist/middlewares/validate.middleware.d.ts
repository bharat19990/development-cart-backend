import { ClassConstructor } from 'class-transformer';
import { RequestHandler } from 'express';
export declare function validateBody<T extends object>(dtoClass: ClassConstructor<T>): RequestHandler;

import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthUserMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    constructor(jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    use(req: Request, _res: Response, next: NextFunction): Promise<void>;
}

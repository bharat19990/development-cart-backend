import { JwtPayload } from '../types/jwt-payload.interface';
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;

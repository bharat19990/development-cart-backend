"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const role_enum_1 = require("../../common/enums/role.enum");
const utils_1 = require("../../common/utils");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("./entities/user.entity");
const userSelect = {
    id: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const hashedPassword = await (0, utils_1.hashPassword)(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role ?? role_enum_1.Role.USER,
            },
            select: userSelect,
        });
        const accessToken = await this.signToken(user);
        return {
            accessToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordValid = await (0, utils_1.comparePassword)(dto.password, user.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const accessToken = await this.signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            user: new user_entity_1.UserEntity({
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }),
        };
    }
    signToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.signAsync(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
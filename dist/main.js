"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const filters_1 = require("./common/filters");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new filters_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port', 3000);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map
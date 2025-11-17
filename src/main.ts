import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ----------------------
  // Global pipes
  // ----------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties exist
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // TODO:
  // ----------------------
  // Global exception filter
  // ----------------------
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // ----------------------
  // Enable CORS
  // ----------------------
  // app.enableCors();

  // ----------------------
  // Swagger setup
  // ----------------------
  const config = new DocumentBuilder()
    .setTitle('Aitika API')
    .setDescription('Aitika NestJS backend API')
    .setVersion('1.0')
    // .addBearerAuth() // Optional JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // ----------------------
  // Start server
  // ----------------------
  const port = Number(process.env.APP_PORT ?? 3000);
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(
    `Swagger docs available on http://localhost:${port}/api-docs`,
    'Bootstrap',
  );
}

bootstrap();
